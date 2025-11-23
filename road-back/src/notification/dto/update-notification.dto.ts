import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: 'Marcar la notificación como leída o no leída',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
