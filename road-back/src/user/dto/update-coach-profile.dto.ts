import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsDateString, IsUrl, IsObject } from 'class-validator';

export class UpdateCoachProfileDto {
  @ApiPropertyOptional({
    description: 'Nombre para mostrar',
    example: 'Carlo Ancelotti',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Especialidad',
    example: 'Técnico',
  })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({
    description: 'Nivel de licencia',
    example: 'UEFA Pro',
  })
  @IsOptional()
  @IsString()
  licenseLevel?: string;

  @ApiPropertyOptional({
    description: 'Años de experiencia',
    example: 30,
  })
  @IsOptional()
  @IsInt()
  yearsExperience?: number;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento',
    example: '1959-06-10',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Nacionalidad',
    example: 'Italia',
  })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({
    description: 'Biografía',
    example: 'Entrenador profesional con múltiples títulos',
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
    description: 'Logros (JSON)',
    example: { teams: ['Real Madrid', 'AC Milan'], titles: 25 },
  })
  @IsOptional()
  @IsObject()
  achievements?: any;
}
