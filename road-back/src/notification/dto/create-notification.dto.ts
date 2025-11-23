import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({
    enum: NotificationType,
    description: 'Tipo de notificación',
    example: 'CHALLENGE_NEW',
    enumName: 'NotificationType'
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Título de la notificación',
    example: '¡Nuevo reto disponible!'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Mensaje descriptivo de la notificación',
    example: 'Se ha creado un nuevo reto de dificultad EASY. ¡Participa ahora!'
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Datos adicionales relacionados con la notificación',
    example: { challengeId: 'clh1234567890', difficulty: 'EASY' }
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiProperty({
    description: 'ID del usuario destinatario de la notificación',
    example: 'clh1234567890'
  })
  @IsString()
  userId: string;
}
