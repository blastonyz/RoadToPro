import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'ID del reto al que se está participando',
    example: 'clh1234567890'
  })
  @IsString()
  challengeId: string;

  @ApiPropertyOptional({
    description: 'Descripción de la participación',
    example: 'Mi increíble participación en el reto'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'ID del video subido a Arka CDN',
    example: 'arka_video_xyz789'
  })
  @IsString()
  arkaFileId: string;

  @ApiProperty({
    description: 'URL pública del video en Arka CDN',
    example: 'https://cdn.arka.network/videos/xyz789.mp4'
  })
  @IsString()
  videoUrl: string;

  @ApiPropertyOptional({
    description: 'URL de la miniatura del video',
    example: 'https://cdn.arka.network/thumbnails/xyz789.jpg'
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'Metadatos adicionales de la participación',
    example: { duration: 120, resolution: '1080p' }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
