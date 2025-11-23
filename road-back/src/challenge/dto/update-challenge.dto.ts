import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ChallengeStatus } from '@prisma/client';

export class UpdateChallengeDto {
  @ApiPropertyOptional({
    description: 'Nuevo título del reto',
    example: 'Reto actualizado'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Nueva descripción del reto',
    example: 'Descripción actualizada del reto'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: ChallengeStatus,
    description: 'Estado del reto (ACTIVE, COMPLETED, EXPIRED)',
    example: 'ACTIVE',
    enumName: 'ChallengeStatus'
  })
  @IsOptional()
  @IsEnum(ChallengeStatus)
  status?: ChallengeStatus;

  @ApiPropertyOptional({
    description: 'Recompensas actualizadas',
    example: { tokens: 150, badge: 'pro_player' }
  })
  @IsOptional()
  @IsObject()
  rewards?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Metadatos actualizados',
    example: { featured: true, priority: 'high' }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
