import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateCouponDto {
  @ApiProperty({
    description: 'Código único del cupón a validar',
    example: 'GAS-2025-ABC123',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
