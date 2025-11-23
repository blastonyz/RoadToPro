import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateNotificationDto } from './dto/create-notification.dto.js';
import { UpdateNotificationDto } from './dto/update-notification.dto.js';
import { NotificationFilterDto } from './dto/notification-filter.dto.js';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) { }

  /**
   * Crear una notificación
   */
  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        type: dto.type,
        title: dto.title,
        message: dto.message,
        data: dto.data,
        userId: dto.userId,
      },
    });
  }

  /**
   * Crear notificaciones masivas para múltiples usuarios
   */
  async createBulk(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>,
  ) {
    const notifications = userIds.map((userId) => ({
      userId,
      type,
      title,
      message,
      data,
    }));

    const result = await this.prisma.notification.createMany({
      data: notifications,
      skipDuplicates: true,
    });

    this.logger.log(`Created ${result.count} notifications for ${userIds.length} users`);
    return result;
  }

  /**
   * Obtener notificaciones de un usuario con filtros
   */
  async findByUser(userId: string, filters: NotificationFilterDto) {
    const { type, isRead, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (type) where.type = type;
    if (isRead !== undefined) where.isRead = isRead;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener una notificación por ID
   */
  async findOne(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  /**
   * Actualizar una notificación (marcar como leída)
   */
  async update(id: string, userId: string, dto: UpdateNotificationDto) {
    const notification = await this.findOne(id, userId);

    return this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        isRead: dto.isRead,
        readAt: dto.isRead ? new Date() : null,
      },
    });
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    this.logger.log(`Marked ${result.count} notifications as read for user ${userId}`);
    return result;
  }

  /**
   * Eliminar una notificación
   */
  async remove(id: string, userId: string) {
    const notification = await this.findOne(id, userId);
    return this.prisma.notification.delete({
      where: { id: notification.id },
    });
  }

  /**
   * Obtener el conteo de notificaciones no leídas
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { count };
  }

  /**
   * Limpiar notificaciones antiguas (más de 30 días)
   */
  async cleanOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.prisma.notification.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
        isRead: true,
      },
    });

    this.logger.log(`Cleaned ${result.count} old notifications`);
    return result;
  }

  // ============================================
  // MÉTODOS DE NOTIFICACIONES AUTOMÁTICAS
  // ============================================

  /**
   * Notificar a todos los usuarios sobre un nuevo reto
   */
  async notifyNewChallenge(challengeId: string, challengeTitle: string) {
    const users = await this.prisma.user.findMany({
      select: { id: true },
    });

    const userIds = users.map((u) => u.id);

    return this.createBulk(
      userIds,
      NotificationType.CHALLENGE_NEW,
      'Nuevo Reto Disponible',
      `¡Participa en el reto "${challengeTitle}"! Sube tu video y compite.`,
      { challengeId },
    );
  }

  /**
   * Notificar sobre un reto próximo a expirar (24h antes)
   */
  async notifyChallengeEnding(challengeId: string, challengeTitle: string) {
    const users = await this.prisma.user.findMany({
      select: { id: true },
    });

    const userIds = users.map((u) => u.id);

    return this.createBulk(
      userIds,
      NotificationType.CHALLENGE_ENDING,
      'Reto Próximo a Expirar',
      `El reto "${challengeTitle}" expira en 24 horas. ¡Última oportunidad para participar!`,
      { challengeId },
    );
  }

  /**
   * Notificar que una participación fue aprobada
   */
  async notifySubmissionApproved(
    userId: string,
    submissionId: string,
    challengeTitle: string,
    score?: number,
  ) {
    return this.create({
      userId,
      type: NotificationType.SUBMISSION_APPROVED,
      title: 'Participación Aprobada',
      message: `Tu participación en "${challengeTitle}" ha sido aprobada${score ? ` con ${score} puntos` : ''}.`,
      data: { submissionId, score },
    });
  }

  /**
   * Notificar que una participación fue rechazada
   */
  async notifySubmissionRejected(
    userId: string,
    submissionId: string,
    challengeTitle: string,
    feedback?: string,
  ) {
    return this.create({
      userId,
      type: NotificationType.SUBMISSION_REJECTED,
      title: 'Participación Rechazada',
      message: `Tu participación en "${challengeTitle}" no ha sido aprobada.${feedback ? ` Motivo: ${feedback}` : ''}`,
      data: { submissionId, feedback },
    });
  }

  /**
   * Notificar sobre inicio de torneo
   */
  async notifyTournamentStart(tournamentId: string, tournamentName: string) {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        participants: {
          include: {
            tournament: {
              include: {
                organizer: true,
              },
            },
          },
        },
      },
    });

    if (!tournament) return;

    // Notificar a participantes
    const userIds = []; // Aquí deberías obtener los IDs de usuarios de los participantes

    if (userIds.length > 0) {
      return this.createBulk(
        userIds,
        NotificationType.TOURNAMENT_START,
        'Torneo Iniciado',
        `El torneo "${tournamentName}" ha comenzado. ¡Buena suerte!`,
        { tournamentId },
      );
    }
  }
}
