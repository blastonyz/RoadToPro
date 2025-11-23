import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChallengeService } from '../challenge/challenge.service.js';
import { NotificationService } from '../notification/notification.service.js';
import { ChallengeDifficulty } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly challengeService: ChallengeService,
    private readonly notificationService: NotificationService,
  ) { }

  /**
   * Crear un reto automático cada día a las 00:00
   * Alterna entre diferentes dificultades
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createDailyChallenge() {
    try {
      this.logger.log('Creating daily challenge...');

      // Obtener el día del año para alternar dificultades
      const dayOfYear = Math.floor(
        (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        1000 /
        60 /
        60 /
        24,
      );

      // Alternar dificultades: 3 días EASY, 2 días MEDIUM, 1 día HARD, 1 día EXTREME
      let difficulty: ChallengeDifficulty;
      const cycleDay = dayOfYear % 7;

      if (cycleDay < 3) {
        difficulty = ChallengeDifficulty.EASY;
      } else if (cycleDay < 5) {
        difficulty = ChallengeDifficulty.MEDIUM;
      } else if (cycleDay < 6) {
        difficulty = ChallengeDifficulty.HARD;
      } else {
        difficulty = ChallengeDifficulty.EXTREME;
      }

      const challenge = await this.challengeService.createAutomaticChallenge(difficulty);
      this.logger.log(
        `Created automatic challenge: ${challenge.title} (${challenge.difficulty})`,
      );
    } catch (error) {
      this.logger.error('Failed to create daily challenge:', error);
    }
  }

  /**
   * Crear un reto fácil cada 6 horas
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async createFrequentChallenge() {
    try {
      this.logger.log('Creating frequent easy challenge...');

      const challenge = await this.challengeService.createAutomaticChallenge(
        ChallengeDifficulty.EASY,
      );

      this.logger.log(`Created frequent challenge: ${challenge.title}`);
    } catch (error) {
      this.logger.error('Failed to create frequent challenge:', error);
    }
  }

  /**
   * Marcar retos expirados cada hora
   */
  @Cron(CronExpression.EVERY_HOUR)
  async expireChallenges() {
    try {
      this.logger.log('Checking for expired challenges...');
      await this.challengeService.expireChallenges();
    } catch (error) {
      this.logger.error('Failed to expire challenges:', error);
    }
  }

  /**
   * Notificar sobre retos próximos a expirar cada 6 horas
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async notifyExpiringChallenges() {
    try {
      this.logger.log('Checking for expiring challenges...');
      await this.challengeService.notifyExpiringChallenges();
    } catch (error) {
      this.logger.error('Failed to notify expiring challenges:', error);
    }
  }

  /**
   * Limpiar notificaciones antiguas cada semana
   */
  @Cron(CronExpression.EVERY_WEEK)
  async cleanOldNotifications() {
    try {
      this.logger.log('Cleaning old notifications...');
      await this.notificationService.cleanOldNotifications();
    } catch (error) {
      this.logger.error('Failed to clean old notifications:', error);
    }
  }

  /**
   * Crear un reto especial los lunes (semanal)
   */
  @Cron('0 12 * * 1') // Lunes a las 12:00
  async createWeeklyChallenge() {
    try {
      this.logger.log('Creating weekly challenge...');

      const challenge = await this.challengeService.createAutomaticChallenge(
        ChallengeDifficulty.MEDIUM,
      );

      this.logger.log(`Created weekly challenge: ${challenge.title}`);
    } catch (error) {
      this.logger.error('Failed to create weekly challenge:', error);
    }
  }

  /**
   * Crear un reto mensual el primer día de cada mes
   */
  @Cron('0 0 1 * *') // A las 00:00 el día 1 de cada mes
  async createMonthlyChallenge() {
    try {
      this.logger.log('Creating monthly challenge...');

      const challenge = await this.challengeService.createAutomaticChallenge(
        ChallengeDifficulty.EXTREME,
      );

      this.logger.log(`Created monthly challenge: ${challenge.title}`);
    } catch (error) {
      this.logger.error('Failed to create monthly challenge:', error);
    }
  }
}
