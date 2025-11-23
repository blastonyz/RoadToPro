import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  IsObject,
  IsEnum,
  IsDateString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SportingGoalDto {
  @ApiProperty({ example: 'Mejorar precisión de pase al 90%' })
  @IsString()
  goal: string;
}

export class BudgetDto {
  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsInt()
  nutrition?: number;

  @ApiPropertyOptional({ example: 350 })
  @IsOptional()
  @IsInt()
  personalTrainer?: number;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @IsInt()
  travels?: number;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsInt()
  equipment?: number;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @IsInt()
  physiotherapy?: number;

  @ApiProperty({ example: 1200 })
  @IsInt()
  total: number;
}

export class TimelineItemDto {
  @ApiProperty({ example: '2025-02-01' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Semana 1: +2 puntos OL' })
  @IsString()
  milestone: string;
}

export class FeaturedChallengeDto {
  @ApiProperty({ example: 'Control orientado bajo presión' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Técnica' })
  @IsString()
  category: string;

  @ApiProperty({ example: 50 })
  @IsInt()
  points: number;

  @ApiProperty({ example: true })
  validated: boolean;

  @ApiProperty({ example: 'Staff OL' })
  @IsString()
  validator: string;
}

export class CreateCampaignDto {
  @ApiProperty({
    description: 'Título de la campaña',
    example: 'Campaña del Jugador - Cristiano Ronaldo',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada',
    example: 'Campaña de financiamiento para desarrollo profesional',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto principal',
    example: 'https://example.com/photo.jpg',
  })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @ApiPropertyOptional({
    description: 'URL del video de presentación',
    example: 'https://example.com/video.mp4',
  })
  @IsOptional()
  @IsUrl()
  presentationVideo?: string;

  @ApiProperty({
    description: 'Rating OL del jugador (0-100)',
    example: 78,
    minimum: 0,
    maximum: 100,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  olRating: number;

  @ApiProperty({
    description: 'Metas deportivas del jugador',
    type: [SportingGoalDto],
    example: [
      { goal: 'Mejorar precisión de pase al 90%' },
      { goal: 'Aumentar resistencia aeróbica nivel 8/10' },
      { goal: 'Prueba en club semiprofesional' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SportingGoalDto)
  sportingGoals: SportingGoalDto[];

  @ApiProperty({
    description: 'Presupuesto con desglose',
    type: BudgetDto,
    example: {
      nutrition: 200,
      personalTrainer: 350,
      travels: 300,
      equipment: 150,
      physiotherapy: 200,
      total: 1200,
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => BudgetDto)
  budget: BudgetDto;

  @ApiProperty({
    description: 'Cronograma con hitos',
    type: [TimelineItemDto],
    example: [
      { date: '2025-02-01', milestone: 'Semana 1: +2 puntos OL' },
      { date: '2025-02-08', milestone: 'Semana 2: Objetivo físico cumplido' },
      { date: '2025-02-15', milestone: 'Semana 3: Nuevo récord de precisión' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimelineItemDto)
  timeline: TimelineItemDto[];

  @ApiPropertyOptional({
    description: 'Retos destacados verificados',
    type: [FeaturedChallengeDto],
    example: [
      {
        name: 'Control orientado bajo presión',
        category: 'Técnica',
        points: 50,
        validated: true,
        validator: 'Staff OL',
      },
      {
        name: 'Sprint 40m',
        category: 'Física',
        points: 30,
        validated: true,
        validator: 'Staff OL',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeaturedChallengeDto)
  featuredChallenges?: FeaturedChallengeDto[];

  @ApiProperty({
    description: 'ID del jugador para quien se crea la campaña',
    example: 'uuid-del-jugador',
  })
  @IsString()
  playerId: string;

  @ApiPropertyOptional({
    description: 'Fecha de inicio de la campaña',
    example: '2025-02-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin de la campaña',
    example: '2025-05-01',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
