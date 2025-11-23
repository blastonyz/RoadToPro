import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationService } from './notification.service.js';
import { UpdateNotificationDto } from './dto/update-notification.dto.js';
import { NotificationFilterDto } from './dto/notification-filter.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  @ApiOperation({
    summary: 'Obtener notificaciones del usuario',
    description: 'Lista todas las notificaciones del usuario autenticado con filtros opcionales'
  })
  @ApiQuery({ name: 'type', required: false, description: 'Tipo de notificación (CHALLENGE_NEW, SUBMISSION_APPROVED, etc.)' })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean, description: 'Filtrar por leídas/no leídas' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Resultados por página (default: 20)' })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAll(@Request() req, @Query() filters: NotificationFilterDto) {
    return this.notificationService.findByUser(req.user.id, filters);
  }

  @Get('unread-count')
  @ApiOperation({
    summary: 'Obtener contador de notificaciones no leídas',
    description: 'Retorna el número de notificaciones no leídas del usuario'
  })
  @ApiResponse({ status: 200, description: 'Contador obtenido exitosamente', schema: { example: { count: 5 } } })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getUnreadCount(@Request() req) {
    return this.notificationService.getUnreadCount(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener notificación específica',
    description: 'Obtiene los detalles de una notificación por su ID'
  })
  @ApiResponse({ status: 200, description: 'Notificación encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.notificationService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar notificación',
    description: 'Actualiza el estado de una notificación (marcar como leída/no leída)'
  })
  @ApiResponse({ status: 200, description: 'Notificación actualizada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
    @Request() req,
  ) {
    return this.notificationService.update(id, req.user.id, dto);
  }

  @Patch('mark-all/read')
  @ApiOperation({
    summary: 'Marcar todas las notificaciones como leídas',
    description: 'Marca todas las notificaciones del usuario como leídas'
  })
  @ApiResponse({ status: 200, description: 'Todas las notificaciones marcadas como leídas' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar notificación',
    description: 'Elimina una notificación específica del usuario'
  })
  @ApiResponse({ status: 200, description: 'Notificación eliminada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.notificationService.remove(id, req.user.id);
  }
}
