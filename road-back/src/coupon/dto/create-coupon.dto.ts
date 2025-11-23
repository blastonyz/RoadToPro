import { IsString, IsEnum, IsOptional, IsInt, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CouponType } from '@prisma/client';

export class CreateCouponDto {
  @ApiProperty({
    enum: CouponType,
    description: 'Tipo de cupón a crear',
    example: CouponType.GAS_SPONSORSHIP,
    enumName: 'CouponType',
  })
  @IsEnum(CouponType)
  type: CouponType;

  @ApiPropertyOptional({
    description: 'Descripción opcional del cupón',
    example: 'Cupón de gas para jugador profesional - Mes de diciembre',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Número máximo de veces que se puede usar el cupón',
    example: 10,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number = 1;

  @ApiPropertyOptional({
    description: 'Monto máximo por uso (aplicable principalmente a gas sponsorship)',
    example: 100.50,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAmountPerUse?: number;

  @ApiPropertyOptional({
    description: 'Fecha de expiración del cupón (ISO 8601). Si no se proporciona, el cupón no expira',
    example: '2025-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Código personalizado para el cupón. Si no se proporciona, se genera automáticamente',
    example: 'CUSTOM-CODE-2025',
  })
  @IsOptional()
  @IsString()
  customCode?: string; // Código personalizado opcional
}
