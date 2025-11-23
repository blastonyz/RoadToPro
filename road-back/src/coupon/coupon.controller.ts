import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CouponService } from './coupon.service.js';
import { CreateCouponDto, ValidateCouponDto, UseCouponDto } from './dto/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('coupons')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) { }

  /**
   * POST /coupons - Crear un nuevo cupón (solo super admin)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo cupón (Solo Super Admin)',
    description: 'Crea un cupón temporal que puede ser usado para gas sponsorship, subida de archivos o features premium. Si el tipo es GAS_SPONSORSHIP, se crea automáticamente un policy en Arka CDN.',
  })
  @ApiBody({ type: CreateCouponDto })
  @ApiResponse({
    status: 201,
    description: 'Cupón creado exitosamente. Si es de tipo GAS_SPONSORSHIP, incluye arkaPolicyId y arkaWalletAddress.',
    schema: {
      example: {
        id: 'uuid',
        code: 'GAS-2025-ABC123',
        type: 'GAS_SPONSORSHIP',
        description: 'Cupón de gas para jugador profesional',
        arkaPolicyId: 'policy-123456',
        arkaWalletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        maxUses: 10,
        currentUses: 0,
        maxAmountPerUse: 100.50,
        status: 'ACTIVE',
        expiresAt: '2025-12-31T23:59:59.000Z',
        createdAt: '2025-11-16T10:37:00.000Z',
        createdBy: {
          id: 'uuid',
          email: 'admin@openleague.com',
          name: 'Super Admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o código de cupón ya existe',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo los super admins pueden crear cupones',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al crear policy en Arka CDN',
  })
  async createCoupon(
    @Body() createCouponDto: CreateCouponDto,
    @Request() req,
  ) {
    return this.couponService.createCoupon(createCouponDto, req.user.userId);
  }

  /**
   * POST /coupons/validate - Validar un cupón sin usarlo
   */
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validar un cupón sin usarlo (Público)',
    description: 'Verifica si un cupón es válido, está activo, no ha expirado y tiene usos disponibles. No requiere autenticación.',
  })
  @ApiBody({ type: ValidateCouponDto })
  @ApiResponse({
    status: 200,
    description: 'Cupón válido',
    schema: {
      example: {
        valid: true,
        coupon: {
          id: 'uuid',
          code: 'GAS-2025-ABC123',
          type: 'GAS_SPONSORSHIP',
          description: 'Cupón de gas para jugador profesional',
          status: 'ACTIVE',
          maxUses: 10,
          currentUses: 2,
          remainingUses: 8,
          maxAmountPerUse: 100.50,
          expiresAt: '2025-12-31T23:59:59.000Z',
          createdBy: {
            id: 'uuid',
            email: 'admin@openleague.com',
            name: 'Super Admin',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Cupón no está activo, expirado o alcanzó el máximo de usos',
  })
  @ApiResponse({
    status: 404,
    description: 'Cupón no encontrado',
  })
  async validateCoupon(@Body() validateCouponDto: ValidateCouponDto) {
    return this.couponService.validateCoupon(validateCouponDto);
  }

  /**
   * POST /coupons/use - Usar un cupón
   */
  @Post('use')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Usar un cupón (Autenticado)',
    description: 'Registra el uso de un cupón válido. Valida que el cupón esté activo, no haya expirado, tenga usos disponibles y que el monto no exceda el límite (si aplica).',
  })
  @ApiBody({ type: UseCouponDto })
  @ApiResponse({
    status: 200,
    description: 'Cupón usado exitosamente',
    schema: {
      example: {
        success: true,
        usage: {
          id: 'uuid',
          couponId: 'uuid',
          userId: 'uuid',
          usedAt: '2025-11-16T10:37:00.000Z',
          amount: 50.00,
          txHash: '0x123...',
          metadata: { action: 'mint_player_nft' },
          ipAddress: '192.168.1.1',
        },
        coupon: {
          id: 'uuid',
          code: 'GAS-2025-ABC123',
          type: 'GAS_SPONSORSHIP',
          status: 'ACTIVE',
          maxUses: 10,
          currentUses: 3,
          remainingUses: 7,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Cupón inválido, expirado, sin usos disponibles o monto excede el límite',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 404,
    description: 'Cupón no encontrado',
  })
  async useCoupon(
    @Body() useCouponDto: UseCouponDto,
    @Request() req,
  ) {
    return this.couponService.useCoupon(useCouponDto, req.user.userId);
  }

  /**
   * GET /coupons - Obtener todos los cupones (solo super admin)
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todos los cupones (Solo Super Admin)',
    description: 'Lista todos los cupones existentes con su información completa, incluyendo el historial de usos. Solo accesible para super admins.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos los cupones',
    schema: {
      example: [
        {
          id: 'uuid',
          code: 'GAS-2025-ABC123',
          type: 'GAS_SPONSORSHIP',
          description: 'Cupón de gas para jugador profesional',
          arkaPolicyId: 'policy-123456',
          arkaWalletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          maxUses: 10,
          currentUses: 2,
          maxAmountPerUse: 100.50,
          status: 'ACTIVE',
          expiresAt: '2025-12-31T23:59:59.000Z',
          createdAt: '2025-11-16T10:37:00.000Z',
          createdBy: {
            id: 'uuid',
            email: 'admin@openleague.com',
            name: 'Super Admin',
          },
          usages: [
            {
              id: 'uuid',
              usedAt: '2025-11-16T11:00:00.000Z',
              amount: 50.00,
              user: {
                id: 'uuid',
                email: 'player@example.com',
                name: 'Jugador Pro',
              },
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo los super admins pueden ver todos los cupones',
  })
  async getAllCoupons(@Request() req) {
    return this.couponService.getAllCoupons(req.user.userId);
  }

  /**
   * GET /coupons/my-usage - Obtener el historial de uso de cupones del usuario
   */
  @Get('my-usage')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener mi historial de uso de cupones (Autenticado)',
    description: 'Obtiene el historial completo de cupones usados por el usuario autenticado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial de uso de cupones del usuario',
    schema: {
      example: [
        {
          id: 'uuid',
          usedAt: '2025-11-16T11:00:00.000Z',
          amount: 50.00,
          txHash: '0x123...',
          metadata: { action: 'mint_player_nft' },
          ipAddress: '192.168.1.1',
          coupon: {
            id: 'uuid',
            code: 'GAS-2025-ABC123',
            type: 'GAS_SPONSORSHIP',
            description: 'Cupón de gas para jugador profesional',
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async getMyUsage(@Request() req) {
    return this.couponService.getUserCouponUsage(req.user.userId);
  }

  /**
   * GET /coupons/:code - Obtener un cupón por código (solo super admin)
   */
  @Get(':code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener un cupón por código (Solo Super Admin)',
    description: 'Obtiene la información detallada de un cupón específico, incluyendo todo su historial de uso. Solo accesible para super admins.',
  })
  @ApiParam({
    name: 'code',
    description: 'Código único del cupón',
    example: 'GAS-2025-ABC123',
  })
  @ApiResponse({
    status: 200,
    description: 'Información detallada del cupón',
    schema: {
      example: {
        id: 'uuid',
        code: 'GAS-2025-ABC123',
        type: 'GAS_SPONSORSHIP',
        description: 'Cupón de gas para jugador profesional',
        arkaPolicyId: 'policy-123456',
        arkaWalletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        maxUses: 10,
        currentUses: 2,
        remainingUses: 8,
        maxAmountPerUse: 100.50,
        status: 'ACTIVE',
        expiresAt: '2025-12-31T23:59:59.000Z',
        createdAt: '2025-11-16T10:37:00.000Z',
        createdBy: {
          id: 'uuid',
          email: 'admin@openleague.com',
          name: 'Super Admin',
        },
        usages: [
          {
            id: 'uuid',
            usedAt: '2025-11-16T11:00:00.000Z',
            amount: 50.00,
            txHash: '0x123...',
            user: {
              id: 'uuid',
              email: 'player@example.com',
              name: 'Jugador Pro',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo los super admins pueden ver detalles de cupones',
  })
  @ApiResponse({
    status: 404,
    description: 'Cupón no encontrado',
  })
  async getCouponByCode(
    @Param('code') code: string,
    @Request() req,
  ) {
    return this.couponService.getCouponByCode(code, req.user.userId);
  }

  /**
   * DELETE /coupons/:code - Revocar un cupón (solo super admin)
   */
  @Delete(':code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Revocar un cupón (Solo Super Admin)',
    description: 'Cambia el estado de un cupón a REVOKED, haciéndolo inválido para futuros usos. Esta acción no puede deshacerse. Solo accesible para super admins.',
  })
  @ApiParam({
    name: 'code',
    description: 'Código único del cupón a revocar',
    example: 'GAS-2025-ABC123',
  })
  @ApiResponse({
    status: 200,
    description: 'Cupón revocado exitosamente',
    schema: {
      example: {
        id: 'uuid',
        code: 'GAS-2025-ABC123',
        type: 'GAS_SPONSORSHIP',
        status: 'REVOKED',
        maxUses: 10,
        currentUses: 2,
        updatedAt: '2025-11-16T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo los super admins pueden revocar cupones',
  })
  @ApiResponse({
    status: 404,
    description: 'Cupón no encontrado',
  })
  async revokeCoupon(
    @Param('code') code: string,
    @Request() req,
  ) {
    return this.couponService.revokeCoupon(code, req.user.userId);
  }
}
