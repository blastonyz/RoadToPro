import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber, IsDateString, IsUrl, IsObject } from 'class-validator';

export class UpdatePlayerProfileDto {
  @ApiPropertyOptional({
    description: 'Nombre para mostrar',
    example: 'Cristiano Ronaldo',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Posición del jugador',
    example: 'Delantero',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: 'Número de camiseta',
    example: 7,
  })
  @IsOptional()
  @IsInt()
  jerseyNumber?: number;

  @ApiPropertyOptional({
    description: 'Altura en cm',
    example: 187,
  })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({
    description: 'Peso en kg',
    example: 83,
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento',
    example: '1985-02-05',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Nacionalidad',
    example: 'Portugal',
  })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({
    description: 'Biografía',
    example: 'Jugador profesional con más de 15 años de experiencia',
  })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiPropertyOptional({
    description: 'URL del avatar',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Estadísticas del jugador (JSON)',
    example: { goals: 50, assists: 20, matches: 100 },
  })
  @IsOptional()
  @IsObject()
  statistics?: any;

  @ApiPropertyOptional({
    description: 'Logros y premios (JSON)',
    example: { trophies: ['Champions League', 'La Liga'], awards: ['Balón de Oro'] },
  })
  @IsOptional()
  @IsObject()
  achievements?: any;
}
