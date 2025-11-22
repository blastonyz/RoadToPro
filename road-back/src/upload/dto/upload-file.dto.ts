import { IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({
    description: 'Descripción del archivo',
    example: 'Mi imagen de perfil',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Comprimir archivo (solo imágenes/videos)',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  compress?: boolean;

  @ApiProperty({
    description: 'Convertir a DASH streaming (solo videos, temporalmente deshabilitado)',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  enableDashStreaming?: boolean;

  @ApiProperty({
    description: 'Tiempo de vida en milisegundos (mínimo 60000ms = 1 minuto)',
    example: 86400000,
    minimum: 60000,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(60000)
  ttl?: number;
}
