import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  /**
   * Obtener estadísticas del sistema (solo super admin)
   */
  async getSystemStats() {
    const [
      totalUsers,
      totalTournaments,
      totalWallets,
      totalFiles,
      recentUsers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.tournament.count(),
      this.prisma.wallet.count(),
      this.prisma.file.count(),
      this.prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          isVerified: true,
          role: true,
        },
      }),
    ]);

    return {
      stats: {
        totalUsers,
        totalTournaments,
        totalWallets,
        totalFiles,
      },
      recentUsers,
    };
  }

  /**
   * Listar todos los usuarios (solo super admin)
   */
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        role: true,
        isSuperAdmin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            wallets: true,
            tournaments: true,
            files: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Cambiar el rol de un usuario (solo super admin)
   */
  async updateUserRole(userId: string, role: 'USER' | 'ADMIN' | 'SUPER_ADMIN') {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role,
        isSuperAdmin: role === 'SUPER_ADMIN',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isSuperAdmin: true,
      },
    });
  }

  /**
   * Verificar manualmente un usuario (solo super admin)
   */
  async verifyUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
      select: {
        id: true,
        email: true,
        isVerified: true,
      },
    });
  }

  /**
   * Eliminar un usuario y todos sus datos (solo super admin)
   */
  async deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Listar todos los torneos (solo super admin)
   */
  async getAllTournaments() {
    return this.prisma.tournament.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Actualizar el estado de un torneo (solo super admin)
   */
  async updateTournamentStatus(
    tournamentId: string,
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
  ) {
    return this.prisma.tournament.update({
      where: { id: tournamentId },
      data: { status },
    });
  }
}
