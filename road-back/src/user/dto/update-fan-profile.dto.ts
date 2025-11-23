import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsObject } from 'class-validator';

export class UpdateFanProfileDto {
  @ApiPropertyOptional({
    description: 'Nombre para mostrar',
    example: 'Fan del Madrid',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Club favorito',
    example: 'Real Madrid',
  })
  @IsOptional()
  @IsString()
  favoriteClub?: string;

  @ApiPropertyOptional({
    description: 'Jugador favorito',
    example: 'Vinicius Jr',
  })
  @IsOptional()
  @IsString()
  favoritePlayer?: string;

  @ApiPropertyOptional({
    description: 'País',
    example: 'España',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'URL del avatar',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Biografía',
    example: 'Seguidor apasionado del fútbol',
  })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiPropertyOptional({
    description: 'Colección de NFTs (JSON)',
    example: { nfts: ['token1', 'token2'] },
  })
  @IsOptional()
  @IsObject()
  nftCollection?: any;
}
