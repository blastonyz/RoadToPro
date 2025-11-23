import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs';
import {
  UpdateUserDto,
  UpdatePlayerProfileDto,
  UpdateClubProfileDto,
  UpdateCoachProfileDto,
  UpdateFanProfileDto,
} from './dto/index.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  /**
   * Actualiza la información básica del usuario (nombre, contraseña)
   */
  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si se quiere cambiar la contraseña, verificar la actual
    if (updateUserDto.newPassword) {
      if (!updateUserDto.currentPassword) {
        throw new BadRequestException(
          'Debes proporcionar la contraseña actual para cambiarla',
        );
      }

      const isPasswordValid = await bcrypt.compare(
        updateUserDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('La contraseña actual es incorrecta');
      }

      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);

      return this.prisma.user.update({
        where: { id: userId },
        data: {
          name: updateUserDto.name,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    // Si no se cambia contraseña, solo actualizar nombre
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateUserDto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Actualiza el perfil de jugador
   */
  async updatePlayerProfile(
    userId: string,
    updateDto: UpdatePlayerProfileDto,
  ) {
    // Verificar que el usuario exista
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { playerProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.playerProfile) {
      throw new NotFoundException(
        'El usuario no tiene un perfil de jugador creado',
      );
    }

    // Preparar datos para actualizar (convertir dateOfBirth si viene)
    const updateData: any = { ...updateDto };
    if (updateDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateDto.dateOfBirth);
    }

    return this.prisma.playerProfile.update({
      where: { userId },
      data: updateData,
    });
  }

  /**
   * Actualiza el perfil de club
   */
  async updateClubProfile(userId: string, updateDto: UpdateClubProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { clubProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.clubProfile) {
      throw new NotFoundException(
        'El usuario no tiene un perfil de club creado',
      );
    }

    return this.prisma.clubProfile.update({
      where: { userId },
      data: updateDto,
    });
  }

  /**
   * Actualiza el perfil de entrenador
   */
  async updateCoachProfile(userId: string, updateDto: UpdateCoachProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { coachProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.coachProfile) {
      throw new NotFoundException(
        'El usuario no tiene un perfil de entrenador creado',
      );
    }

    // Preparar datos para actualizar (convertir dateOfBirth si viene)
    const updateData: any = { ...updateDto };
    if (updateDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateDto.dateOfBirth);
    }

    return this.prisma.coachProfile.update({
      where: { userId },
      data: updateData,
    });
  }

  /**
   * Actualiza el perfil de fan
   */
  async updateFanProfile(userId: string, updateDto: UpdateFanProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { fanProfile: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.fanProfile) {
      throw new NotFoundException(
        'El usuario no tiene un perfil de fan creado',
      );
    }

    return this.prisma.fanProfile.update({
      where: { userId },
      data: updateDto,
    });
  }

  /**
   * Obtiene el perfil completo del usuario autenticado
   */
  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        playerProfile: true,
        clubProfile: true,
        coachProfile: true,
        fanProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }
}
