import { IsString, IsNotEmpty, IsOptional, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UseCouponDto {
  @ApiProperty({
    description: 'Código único del cupón a usar',
    example: 'GAS-2025-ABC123',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    description: 'Monto usado (aplicable principalmente a gas sponsorship)',
    example: 50.00,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({
    description: 'Hash de la transacción relacionada (si aplica)',
    example: '0x123456789abcdef...',
  })
  @IsOptional()
  @IsString()
  txHash?: string;

  @ApiPropertyOptional({
    description: 'Metadata adicional sobre el uso del cupón',
    example: { action: 'mint_player_nft', playerId: 'uuid' },
  })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiPropertyOptional({
    description: 'Dirección IP desde donde se usó el cupón',
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;
}
