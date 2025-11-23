import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
  InternalServerErrorException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCouponDto, UseCouponDto, ValidateCouponDto } from './dto/index.js';
import { CouponStatus, CouponType } from '@prisma/client';
import axios from 'axios';
import { randomBytes } from 'crypto';

@Injectable()
export class CouponService {
  private readonly logger = new Logger(CouponService.name);
  private readonly arkaApiKey: string;
  private readonly arkaApiUrl: string = 'https://arka.biconomy.io/v2';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.arkaApiKey = this.configService.get('ARKA_API_KEY');
    if (!this.arkaApiKey) {
      this.logger.warn('⚠️  ARKA_API_KEY no configurada. Las funciones de gas sponsorship no estarán disponibles.');
    }
  }

  /**
   * Genera un código de cupón único
   */
  private generateCouponCode(type: CouponType, customCode?: string): string {
    if (customCode) {
      return customCode.toUpperCase().replace(/\s/g, '-');
    }

    const typePrefix = {
      [CouponType.GAS_SPONSORSHIP]: 'GAS',
      [CouponType.FILE_UPLOAD]: 'FILE',
      [CouponType.PREMIUM_FEATURE]: 'PREMIUM',
    };

    const prefix = typePrefix[type];
    const randomPart = randomBytes(4).toString('hex').toUpperCase();
    const year = new Date().getFullYear();

    return `${prefix}-${year}-${randomPart}`;
  }

  /**
   * Crea un policy en Arka CDN para gas sponsorship
   */
  private async createArkaCdnPolicy(
    walletAddress: string,
    maxAmountPerUse?: number,
  ): Promise<{ policyId: string }> {
    if (!this.arkaApiKey) {
      throw new InternalServerErrorException('ARKA_API_KEY no configurada');
    }

    try {
      // Crear policy en Arka CDN
      const response = await axios.post(
        `${this.arkaApiUrl}/paymaster/policy`,
        {
          name: `Coupon-Policy-${Date.now()}`,
          description: 'Policy creado desde sistema de cupones OpenLeague',
          sponsorWalletAddress: walletAddress,
          isActive: true,
          maxAmountPerTransaction: maxAmountPerUse ? maxAmountPerUse.toString() : undefined,
          // Configuración adicional según la API de Arka
          whitelist: [], // Puedes agregar direcciones específicas si es necesario
          chainId: 1287, // Moonbase Alpha - ajusta según tu red
        },
        {
          headers: {
            'Authorization': `Bearer ${this.arkaApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`✅ Policy de Arka CDN creado: ${response.data.policyId}`);
      return { policyId: response.data.policyId };
    } catch (error) {
      this.logger.error('Error al crear policy en Arka CDN:', error.response?.data || error.message);
      throw new InternalServerErrorException('Error al crear policy en Arka CDN');
    }
  }

  /**
   * Crea un nuevo cupón (solo super admin)
   */
  async createCoupon(createCouponDto: CreateCouponDto, userId: string) {
    // Verificar que el usuario es super admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { wallets: true },
    });

    if (!user || !user.isSuperAdmin) {
      throw new ForbiddenException('Solo los super admins pueden crear cupones');
    }

    // Generar código único
    const code = this.generateCouponCode(createCouponDto.type, createCouponDto.customCode);

    // Verificar que el código no exista
    const existingCoupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    if (existingCoupon) {
      throw new BadRequestException('El código de cupón ya existe');
    }

    // Variables para Arka CDN
    let arkaPolicyId: string | undefined;
    let arkaWalletAddress: string | undefined;

    // Si es cupón de gas sponsorship, crear policy en Arka CDN
    if (createCouponDto.type === CouponType.GAS_SPONSORSHIP) {
      // Obtener la wallet del super admin (preferiblemente Moonbeam)
      const moonbeamWallet = user.wallets.find(w => w.network === 'moonbeam' || w.provider === 'moonbeam-evm');

      if (!moonbeamWallet) {
        throw new BadRequestException('Super admin no tiene wallet de Moonbeam configurada');
      }

      arkaWalletAddress = moonbeamWallet.address;

      // Crear policy en Arka CDN
      const policy = await this.createArkaCdnPolicy(
        arkaWalletAddress,
        createCouponDto.maxAmountPerUse,
      );

      arkaPolicyId = policy.policyId;
    }

    // Crear cupón en la base de datos
    const coupon = await this.prisma.coupon.create({
      data: {
        code,
        type: createCouponDto.type,
        description: createCouponDto.description,
        arkaPolicyId,
        arkaWalletAddress,
        maxUses: createCouponDto.maxUses || 1,
        maxAmountPerUse: createCouponDto.maxAmountPerUse,
        expiresAt: createCouponDto.expiresAt ? new Date(createCouponDto.expiresAt) : null,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    this.logger.log(`✅ Cupón creado: ${code} (${createCouponDto.type})`);
    return coupon;
  }

  /**
   * Valida un cupón sin usarlo
   */
  async validateCoupon(validateCouponDto: ValidateCouponDto) {
    const { code } = validateCouponDto;

    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
      include: {
        usages: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    // Verificar estado
    if (coupon.status !== CouponStatus.ACTIVE) {
      throw new BadRequestException(`Cupón no está activo. Estado: ${coupon.status}`);
    }

    // Verificar expiración
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      await this.prisma.coupon.update({
        where: { id: coupon.id },
        data: { status: CouponStatus.EXPIRED },
      });
      throw new BadRequestException('Cupón expirado');
    }

    // Verificar usos
    if (coupon.currentUses >= coupon.maxUses) {
      throw new BadRequestException('Cupón ha alcanzado el máximo de usos');
    }

    return {
      valid: true,
      coupon: {
        ...coupon,
        remainingUses: coupon.maxUses - coupon.currentUses,
      },
    };
  }

  /**
   * Usa un cupón
   */
  async useCoupon(useCouponDto: UseCouponDto, userId: string) {
    const { code, amount, txHash, metadata, ipAddress } = useCouponDto;

    // Validar cupón primero
    const validation = await this.validateCoupon({ code });
    const coupon = validation.coupon;

    // Verificar monto si aplica
    if (coupon.maxAmountPerUse && amount && amount > coupon.maxAmountPerUse) {
      throw new BadRequestException(
        `El monto excede el límite permitido por uso: ${coupon.maxAmountPerUse}`,
      );
    }

    // Registrar uso del cupón
    const usage = await this.prisma.couponUsage.create({
      data: {
        couponId: coupon.id,
        userId,
        amount,
        txHash,
        metadata,
        ipAddress,
      },
    });

    // Actualizar contador de usos
    const updatedCoupon = await this.prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        currentUses: { increment: 1 },
        status: coupon.currentUses + 1 >= coupon.maxUses ? CouponStatus.USED : CouponStatus.ACTIVE,
      },
      include: {
        usages: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    this.logger.log(`✅ Cupón usado: ${code} por usuario ${userId}`);

    return {
      success: true,
      usage,
      coupon: {
        ...updatedCoupon,
        remainingUses: updatedCoupon.maxUses - updatedCoupon.currentUses,
      },
    };
  }

  /**
   * Obtiene todos los cupones (solo super admin)
   */
  async getAllCoupons(userId: string) {
    // Verificar que el usuario es super admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isSuperAdmin) {
      throw new ForbiddenException('Solo los super admins pueden ver todos los cupones');
    }

    return this.prisma.coupon.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        usages: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
          orderBy: {
            usedAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Obtiene un cupón por código
   */
  async getCouponByCode(code: string, userId: string) {
    // Verificar que el usuario es super admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isSuperAdmin) {
      throw new ForbiddenException('Solo los super admins pueden ver detalles de cupones');
    }

    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        usages: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
          orderBy: {
            usedAt: 'desc',
          },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    return {
      ...coupon,
      remainingUses: coupon.maxUses - coupon.currentUses,
    };
  }

  /**
   * Revoca un cupón (solo super admin)
   */
  async revokeCoupon(code: string, userId: string) {
    // Verificar que el usuario es super admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isSuperAdmin) {
      throw new ForbiddenException('Solo los super admins pueden revocar cupones');
    }

    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    return this.prisma.coupon.update({
      where: { code },
      data: { status: CouponStatus.REVOKED },
    });
  }

  /**
   * Obtiene el historial de uso de cupones de un usuario
   */
  async getUserCouponUsage(userId: string) {
    return this.prisma.couponUsage.findMany({
      where: { userId },
      include: {
        coupon: true,
      },
      orderBy: {
        usedAt: 'desc',
      },
    });
  }
}
