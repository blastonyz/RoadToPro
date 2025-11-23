import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/index.js';
import { UserRole } from '@prisma/client';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) { }

  /**
   * Crear una nueva campaña (solo admins y super admins)
   */
  async createCampaign(createdById: string, createDto: CreateCampaignDto) {
    // Verificar que el jugador existe y tiene perfil de jugador
    const player = await this.prisma.user.findUnique({
      where: { id: createDto.playerId },
      include: { playerProfile: true },
    });

    if (!player) {
      throw new NotFoundException('Jugador no encontrado');
    }

    if (!player.playerProfile) {
      throw new BadRequestException(
        'El usuario debe tener un perfil de jugador',
      );
    }

    // Crear la campaña
    return this.prisma.playerCampaign.create({
      data: {
        title: createDto.title,
        description: createDto.description,
        photoUrl: createDto.photoUrl,
        presentationVideo: createDto.presentationVideo,
        olRating: createDto.olRating,
        sportingGoals: JSON.parse(JSON.stringify(createDto.sportingGoals)),
        budget: JSON.parse(JSON.stringify(createDto.budget)),
        timeline: JSON.parse(JSON.stringify(createDto.timeline)),
        featuredChallenges: createDto.featuredChallenges
          ? JSON.parse(JSON.stringify(createDto.featuredChallenges))
          : [],
        startDate: createDto.startDate ? new Date(createDto.startDate) : null,
        endDate: createDto.endDate ? new Date(createDto.endDate) : null,
        playerId: createDto.playerId,
        createdById,
      },
      include: {
        player: {
          select: {
            id: true,
            email: true,
            name: true,
            playerProfile: {
              select: {
                displayName: true,
                position: true,
                avatarUrl: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * Obtener todas las campañas (con filtros opcionales)
   */
  async getCampaigns(status?: string, playerId?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (playerId) {
      where.playerId = playerId;
    }

    return this.prisma.playerCampaign.findMany({
      where,
      include: {
        player: {
          select: {
            id: true,
            email: true,
            name: true,
            playerProfile: {
              select: {
                displayName: true,
                position: true,
                avatarUrl: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Obtener una campaña específica por ID
   */
  async getCampaignById(id: string) {
    const campaign = await this.prisma.playerCampaign.findUnique({
      where: { id },
      include: {
        player: {
          select: {
            id: true,
            email: true,
            name: true,
            playerProfile: {
              select: {
                displayName: true,
                position: true,
                avatarUrl: true,
                olIndexOverall: true,
                currentLevel: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    return campaign;
  }

  /**
   * Actualizar una campaña (solo quien la creó o super admin)
   */
  async updateCampaign(
    id: string,
    userId: string,
    userRole: string,
    isSuperAdmin: boolean,
    updateDto: UpdateCampaignDto,
  ) {
    const campaign = await this.prisma.playerCampaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    // Verificar permisos: solo quien creó la campaña o super admin puede editarla
    if (campaign.createdById !== userId && !isSuperAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para editar esta campaña',
      );
    }

    // Preparar datos para actualizar
    const updateData: any = { ...updateDto };

    // Convertir DTOs a JSON plano
    if (updateDto.sportingGoals) {
      updateData.sportingGoals = JSON.parse(JSON.stringify(updateDto.sportingGoals));
    }
    if (updateDto.budget) {
      updateData.budget = JSON.parse(JSON.stringify(updateDto.budget));
    }
    if (updateDto.timeline) {
      updateData.timeline = JSON.parse(JSON.stringify(updateDto.timeline));
    }
    if (updateDto.featuredChallenges) {
      updateData.featuredChallenges = JSON.parse(JSON.stringify(updateDto.featuredChallenges));
    }

    // Convertir fechas si vienen en el DTO
    if (updateDto.startDate) {
      updateData.startDate = new Date(updateDto.startDate);
    }
    if (updateDto.endDate) {
      updateData.endDate = new Date(updateDto.endDate);
    }

    // Eliminar playerId del updateData si existe (no se debe changiar)
    delete updateData.playerId;

    return this.prisma.playerCampaign.update({
      where: { id },
      data: updateData,
      include: {
        player: {
          select: {
            id: true,
            email: true,
            name: true,
            playerProfile: {
              select: {
                displayName: true,
                position: true,
                avatarUrl: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * Eliminar una campaña (solo quien la creó o super admin)
   */
  async deleteCampaign(
    id: string,
    userId: string,
    userRole: string,
    isSuperAdmin: boolean,
  ) {
    const campaign = await this.prisma.playerCampaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    // Verificar permisos
    if (campaign.createdById !== userId && !isSuperAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar esta campaña',
      );
    }

    await this.prisma.playerCampaign.delete({
      where: { id },
    });

    return { message: 'Campaña eliminada exitosamente' };
  }

  /**
   * Obtener campañas de un jugador específico
   */
  async getPlayerCampaigns(playerId: string) {
    return this.prisma.playerCampaign.findMany({
      where: { playerId },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
