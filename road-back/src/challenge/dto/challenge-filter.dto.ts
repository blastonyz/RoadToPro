import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ChallengeDifficulty, ChallengeStatus } from '@prisma/client';

export class ChallengeFilterDto {
  @ApiPropertyOptional({
    enum: ChallengeStatus,
    description: 'Filtrar por estado del reto',
    example: 'ACTIVE',
    enumName: 'ChallengeStatus'
  })
  @IsOptional()
  @IsEnum(ChallengeStatus)
  status?: ChallengeStatus;

  @ApiPropertyOptional({
    enum: ChallengeDifficulty,
    description: 'Filtrar por dificultad del reto',
    example: 'EASY',
    enumName: 'ChallengeDifficulty'
  })
  @IsOptional()
  @IsEnum(ChallengeDifficulty)
  difficulty?: ChallengeDifficulty;

  @ApiPropertyOptional({
    description: 'Número de página para paginación',
    example: 1,
    default: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de resultados por página',
    example: 20,
    default: 20
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 20;
}
