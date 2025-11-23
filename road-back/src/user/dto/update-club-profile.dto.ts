import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsUrl, IsObject } from 'class-validator';

export class UpdateClubProfileDto {
  @ApiPropertyOptional({
    description: 'Nombre corto o siglas del club',
    example: 'RMA',
  })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiPropertyOptional({
    description: 'Año de fundación',
    example: 1902,
  })
  @IsOptional()
  @IsInt()
  foundedYear?: number;

  @ApiPropertyOptional({
    description: 'País',
    example: 'España',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Ciudad',
    example: 'Madrid',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Estadio',
    example: 'Santiago Bernabéu',
  })
  @IsOptional()
  @IsString()
  stadium?: string;

  @ApiPropertyOptional({
    description: 'Descripción del club',
    example: 'Club de fútbol profesional con historia centenaria',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL del logo',
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'URL del banner',
    example: 'https://example.com/banner.jpg',
  })
  @IsOptional()
  @IsUrl()
  bannerUrl?: string;

  @ApiPropertyOptional({
    description: 'Redes sociales (JSON)',
    example: { twitter: '@realmadriden', instagram: '@realmadrid' },
  })
  @IsOptional()
  @IsObject()
  socialLinks?: any;
}
