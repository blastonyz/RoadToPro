import { IsString, IsEnum, IsOptional, IsObject, IsInt, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChallengeDifficulty } from '@prisma/client';

export class CreateChallengeDto {
  @ApiProperty({
    description: 'Título del reto',
    example: 'Reto de habilidades extremas'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descripción detallada del reto',
    example: 'Demuestra tus mejores habilidades en este reto temporal'
  })
  @IsString()
  description: string;

  @ApiProperty({
    enum: ChallengeDifficulty,
    description: 'Nivel de dificultad (determina duración automática: EASY=24h, MEDIUM=7d, HARD=14d, EXTREME=30d)',
    example: 'EASY',
    enumName: 'ChallengeDifficulty'
  })
  @IsEnum(ChallengeDifficulty)
  difficulty: ChallengeDifficulty;

  @ApiPropertyOptional({
    description: 'Número de acciones requeridas para completar el reto',
    example: 1,
    default: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  requiredActions?: number = 1;

  @ApiPropertyOptional({
    description: 'Recompensas del reto',
    example: { tokens: 100, badge: 'challenge_master' }
  })
  @IsOptional()
  @IsObject()
  rewards?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Metadatos adicionales del reto',
    example: { category: 'skills', tags: ['football', 'extreme'] }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'ID del archivo de referencia en Arka CDN',
    example: 'arka_abc123xyz'
  })
  @IsOptional()
  @IsString()
  arkaFileId?: string;

  @ApiPropertyOptional({
    description: 'URL de la miniatura del reto',
    example: 'https://cdn.arka.network/thumbnails/challenge123.jpg'
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'Fecha de expiración personalizada (si no se provee, se calcula según dificultad)',
    example: '2024-12-31T23:59:59Z'
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
