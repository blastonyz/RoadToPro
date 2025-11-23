import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationService } from '../notification/notification.service.js';
import { CreateChallengeDto } from './dto/create-challenge.dto.js';
import { UpdateChallengeDto } from './dto/update-challenge.dto.js';
import { CreateSubmissionDto } from './dto/create-submission.dto.js';
import { UpdateSubmissionDto } from './dto/update-submission.dto.js';
import { ChallengeFilterDto } from './dto/challenge-filter.dto.js';
import { ChallengeDifficulty, ChallengeStatus, SubmissionStatus } from '@prisma/client';

@Injectable()
export class ChallengeService {
  private readonly logger = new Logger(ChallengeService.name);

  // Duración en horas según dificultad
  private readonly DIFFICULTY_DURATION = {
    [ChallengeDifficulty.EASY]: 24, // 24 horas
    [ChallengeDifficulty.MEDIUM]: 168, // 7 días
    [ChallengeDifficulty.HARD]: 336, // 14 días
    [ChallengeDifficulty.EXTREME]: 720, // 30 días
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Crear un nuevo reto (manual o automático)
   */
  async create(dto: CreateChallengeDto) {
    // Calcular fecha de expiración según dificultad si no se provee
    let expiresAt: Date;
    if (dto.expiresAt) {
      expiresAt = new Date(dto.expiresAt);
    } else {
      const hours = this.DIFFICULTY_DURATION[dto.difficulty];
      expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + hours);
    }

    const challenge = await this.prisma.challenge.create({
      data: {
        title: dto.title,
        description: dto.description,
        difficulty: dto.difficulty,
        requiredActions: dto.requiredActions || 1,
        rewards: dto.rewards,
        metadata: dto.metadata,
        arkaFileId: dto.arkaFileId,
        thumbnailUrl: dto.thumbnailUrl,
        expiresAt,
      },
    });

    this.logger.log(`Created challenge ${challenge.id} with difficulty ${challenge.difficulty}`);

    // Notificar a todos los usuarios sobre el nuevo reto
    await this.notificationService.notifyNewChallenge(challenge.id, challenge.title);

    return challenge;
  }

  /**
   * Obtener todos los retos con filtros
   */
  async findAll(filters: ChallengeFilterDto) {
    const { status, difficulty, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (difficulty) where.difficulty = difficulty;

    const [challenges, total] = await Promise.all([
      this.prisma.challenge.findMany({
        where,
        include: {
          _count: {
            select: { submissions: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.challenge.count({ where }),
    ]);

    return {
      data: challenges,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener retos activos
   */
  async findActive() {
    return this.prisma.challenge.findMany({
      where: {
        status: ChallengeStatus.ACTIVE,
        expiresAt: { gt: new Date() },
      },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { expiresAt: 'asc' },
    });
  }

  /**
   * Obtener un reto por ID
   */
  async findOne(id: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: {
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                playerProfile: {
                  select: {
                    displayName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    return challenge;
  }

  /**
   * Actualizar un reto
   */
  async update(id: string, dto: UpdateChallengeDto) {
    const challenge = await this.findOne(id);

    return this.prisma.challenge.update({
      where: { id: challenge.id },
      data: dto,
    });
  }

  /**
   * Eliminar un reto
   */
  async remove(id: string) {
    const challenge = await this.findOne(id);
    return this.prisma.challenge.delete({
      where: { id: challenge.id },
    });
  }

  // ============================================
  // GESTIÓN DE PARTICIPACIONES (SUBMISSIONS)
  // ============================================

  async voteSubmission(userId: string, submissionId: string, value: 1 | -1) {
    const submission = await this.findSubmission(submissionId);

    const existing = await this.prisma.challengeSubmissionVote.findUnique({
      where: {
        userId_submissionId: { userId, submissionId },
      },
    });

    if (existing) {
      if (existing.value === value) {
        await this.prisma.challengeSubmissionVote.delete({
          where: { userId_submissionId: { userId, submissionId } },
        });
      } else {
        await this.prisma.challengeSubmissionVote.update({
          where: { userId_submissionId: { userId, submissionId } },
          data: { value },
        });
      }
    } else {
      await this.prisma.challengeSubmissionVote.create({
        data: {
          userId,
          submissionId: submission.id,
          value,
        },
      });
    }

    return this.getSubmissionVotes(submission.id);
  }

  async getSubmissionVotes(submissionId: string) {
    await this.findSubmission(submissionId);

    const [up, down, sum] = await Promise.all([
      this.prisma.challengeSubmissionVote.count({
        where: { submissionId, value: 1 },
      }),
      this.prisma.challengeSubmissionVote.count({
        where: { submissionId, value: -1 },
      }),
      this.prisma.challengeSubmissionVote.aggregate({
        _sum: { value: true },
        where: { submissionId },
      }),
    ]);

    return {
      up,
      down,
      score: sum._sum.value ?? 0,
    };
  }

  /**
   * Crear una participación en un reto
   */
  async createSubmission(userId: string, dto: CreateSubmissionDto) {
    // Verificar que el reto existe y está activo
    const challenge = await this.findOne(dto.challengeId);

    if (challenge.status !== ChallengeStatus.ACTIVE) {
      throw new BadRequestException('Challenge is not active');
    }

    if (new Date() > challenge.expiresAt) {
      throw new BadRequestException('Challenge has expired');
    }

    // Verificar que el usuario no haya participado ya
    const existingSubmission = await this.prisma.challengeSubmission.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId: dto.challengeId,
        },
      },
    });

    if (existingSubmission) {
      throw new BadRequestException('You have already submitted to this challenge');
    }

    const submission = await this.prisma.challengeSubmission.create({
      data: {
        userId,
        challengeId: dto.challengeId,
        description: dto.description,
        arkaFileId: dto.arkaFileId,
        videoUrl: dto.videoUrl,
        thumbnailUrl: dto.thumbnailUrl,
        metadata: dto.metadata,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        challenge: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
    });

    this.logger.log(`User ${userId} submitted to challenge ${dto.challengeId}`);

    return submission;
  }

  /**
   * Obtener participaciones de un usuario
   */
  async findUserSubmissions(userId: string) {
    return this.prisma.challengeSubmission.findMany({
      where: { userId },
      include: {
        challenge: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtener participaciones de un reto
   */
  async findChallengeSubmissions(challengeId: string) {
    const challenge = await this.findOne(challengeId);

    const submissions = await this.prisma.challengeSubmission.findMany({
      where: { challengeId: challenge.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            playerProfile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: { votes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Obtener conteos UP/DOWN para evitar N+1
    const [upCounts, downCounts] = await Promise.all([
      this.prisma.challengeSubmissionVote.groupBy({
        by: ['submissionId'],
        where: { submissionId: { in: submissions.map((s) => s.id) }, value: 1 },
        _count: { _all: true },
      }),
      this.prisma.challengeSubmissionVote.groupBy({
        by: ['submissionId'],
        where: { submissionId: { in: submissions.map((s) => s.id) }, value: -1 },
        _count: { _all: true },
      }),
    ]);

    const upMap = new Map(upCounts.map((r) => [r.submissionId, r._count._all]));
    const downMap = new Map(downCounts.map((r) => [r.submissionId, r._count._all]));

    return submissions.map((s) => ({
      ...s,
      votes: {
        up: upMap.get(s.id) ?? 0,
        down: downMap.get(s.id) ?? 0,
        score: (upMap.get(s.id) ?? 0) - (downMap.get(s.id) ?? 0),
        total: (upMap.get(s.id) ?? 0) + (downMap.get(s.id) ?? 0),
      },
    }));
  }

  /**
   * Obtener una participación específica
   */
  async findSubmission(id: string) {
    const submission = await this.prisma.challengeSubmission.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        challenge: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }

  async findSubmissions() {
    console.log('findSubmissions')
    const submissions = await this.prisma.challengeSubmission.findMany();

    console.log(submissions)

    if (!submissions) {
      throw new NotFoundException('Submissions not found');
    }

    return submissions;
  }

  /**
   * Actualizar una participación (aprobar/rechazar)
   */
  async updateSubmission(id: string, dto: UpdateSubmissionDto) {
    const submission = await this.findSubmission(id);

    const updated = await this.prisma.challengeSubmission.update({
      where: { id: submission.id },
      data: dto,
      include: {
        user: true,
        challenge: true,
      },
    });

    // Enviar notificación según el estado
    if (dto.status === SubmissionStatus.APPROVED) {
      await this.notificationService.notifySubmissionApproved(
        updated.userId,
        updated.id,
        updated.challenge.title,
        dto.score,
      );
    } else if (dto.status === SubmissionStatus.REJECTED) {
      await this.notificationService.notifySubmissionRejected(
        updated.userId,
        updated.id,
        updated.challenge.title,
        dto.feedback,
      );
    }

    return updated;
  }

  /**
   * Eliminar una participación (solo el usuario que la creó)
   */
  async removeSubmission(id: string, userId: string) {
    const submission = await this.findSubmission(id);

    if (submission.userId !== userId) {
      throw new ForbiddenException('You can only delete your own submissions');
    }

    if (submission.status !== SubmissionStatus.PENDING) {
      throw new BadRequestException('Cannot delete a submission that has been reviewed');
    }

    return this.prisma.challengeSubmission.delete({
      where: { id: submission.id },
    });
  }

  // ============================================
  // TAREAS AUTOMÁTICAS
  // ============================================

  /**
   * Marcar retos expirados como EXPIRED
   */
  async expireChallenges() {
    const result = await this.prisma.challenge.updateMany({
      where: {
        status: ChallengeStatus.ACTIVE,
        expiresAt: { lt: new Date() },
      },
      data: {
        status: ChallengeStatus.EXPIRED,
      },
    });

    this.logger.log(`Expired ${result.count} challenges`);
    return result;
  }

  /**
   * Notificar sobre retos próximos a expirar (24h antes)
   */
  async notifyExpiringChallenges() {
    const in24Hours = new Date();
    in24Hours.setHours(in24Hours.getHours() + 24);

    const in23Hours = new Date();
    in23Hours.setHours(in23Hours.getHours() + 23);

    const expiringChallenges = await this.prisma.challenge.findMany({
      where: {
        status: ChallengeStatus.ACTIVE,
        expiresAt: {
          gte: in23Hours,
          lte: in24Hours,
        },
      },
    });

    for (const challenge of expiringChallenges) {
      await this.notificationService.notifyChallengeEnding(challenge.id, challenge.title);
    }

    this.logger.log(`Notified about ${expiringChallenges.length} expiring challenges`);
    return expiringChallenges;
  }

  /**
   * Crear un reto automático del sistema
   */
  async createAutomaticChallenge(difficulty: ChallengeDifficulty) {
    // Plantillas de retos automáticos
    const templates = {
      [ChallengeDifficulty.EASY]: [
        {
          title: 'Regate Rápido',
          description: 'Muestra tu mejor regate en menos de 10 segundos',
        },
        {
          title: 'Tiro a Puerta',
          description: 'Demuestra tu precisión con un tiro al arco',
        },
        {
          title: 'Control de Balón',
          description: 'Realiza 5 toques sin que el balón toque el suelo',
        },
      ],
      [ChallengeDifficulty.MEDIUM]: [
        {
          title: 'Combo de Habilidades',
          description: 'Ejecuta una secuencia de 3 trucos diferentes',
        },
        {
          title: 'Precisión Total',
          description: 'Haz 5 pases consecutivos a un objetivo pequeño',
        },
      ],
      [ChallengeDifficulty.HARD]: [
        {
          title: 'Freestyle Avanzado',
          description: 'Crea una rutina de freestyle de 30 segundos',
        },
        {
          title: 'Desafío de Velocidad',
          description: 'Completa un circuito con obstáculos en el menor tiempo',
        },
      ],
      [ChallengeDifficulty.EXTREME]: [
        {
          title: 'Maestro del Balón',
          description: 'Crea una rutina épica de 1 minuto con tus mejores habilidades',
        },
      ],
    };

    const difficultyTemplates = templates[difficulty];
    const template = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)];

    return this.create({
      title: template.title,
      description: template.description,
      difficulty,
      requiredActions: 1,
      rewards: this.generateRewards(difficulty),
      metadata: {
        automatic: true,
        createdBy: 'system',
      },
    });
  }

  /**
   * Generar recompensas según dificultad
   */
  private generateRewards(difficulty: ChallengeDifficulty) {
    const rewards = {
      [ChallengeDifficulty.EASY]: {
        points: 100,
        coins: 50,
        experience: 25,
      },
      [ChallengeDifficulty.MEDIUM]: {
        points: 300,
        coins: 150,
        experience: 75,
      },
      [ChallengeDifficulty.HARD]: {
        points: 600,
        coins: 300,
        experience: 150,
      },
      [ChallengeDifficulty.EXTREME]: {
        points: 1000,
        coins: 500,
        experience: 300,
      },
    };

    return rewards[difficulty];
  }
}
