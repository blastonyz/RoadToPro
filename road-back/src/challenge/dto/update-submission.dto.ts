import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SubmissionStatus } from '@prisma/client';

export class UpdateSubmissionDto {
  @ApiPropertyOptional({
    enum: SubmissionStatus,
    description: 'Estado de la participación (PENDING, APPROVED, REJECTED)',
    example: 'APPROVED',
    enumName: 'SubmissionStatus'
  })
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @ApiPropertyOptional({
    description: 'Puntuación de la participación (0-100)',
    example: 95,
    minimum: 0,
    maximum: 100
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number;

  @ApiPropertyOptional({
    description: 'Comentarios o feedback sobre la participación',
    example: 'Excelente ejecución, muy creativo'
  })
  @IsOptional()
  @IsString()
  feedback?: string;
}
