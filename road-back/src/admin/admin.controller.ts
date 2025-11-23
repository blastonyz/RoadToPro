import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard.js';

@ApiTags('Admin - Super Admin Only')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas del sistema (Solo Super Admin)' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas correctamente' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async getSystemStats() {
    return this.adminService.getSystemStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Listar todos los usuarios (Solo Super Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:userId/role')
  @ApiOperation({ summary: 'Cambiar el rol de un usuario (Solo Super Admin)' })
  @ApiResponse({ status: 200, description: 'Rol actualizado correctamente' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async updateUserRole(
    @Param('userId') userId: string,
    @Body('role') role: 'USER' | 'ADMIN' | 'SUPER_ADMIN',
  ) {
    return this.adminService.updateUserRole(userId, role);
  }

  @Post('users/:userId/verify')
  @ApiOperation({ summary: 'Verificar manualmente un usuario (Solo Super Admin)' })
  @ApiResponse({ status: 200, description: 'Usuario verificado correctamente' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async verifyUser(@Param('userId') userId: string) {
    return this.adminService.verifyUser(userId);
  }

  @Delete('users/:userId')
  @ApiOperation({ summary: 'Eliminar un usuario (Solo Super Admin)' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Get('tournaments')
  @ApiOperation({ summary: 'Listar todos los torneos (Solo Super Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de torneos' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async getAllTournaments() {
    return this.adminService.getAllTournaments();
  }

  @Put('tournaments/:tournamentId/status')
  @ApiOperation({ summary: 'Actualizar estado de un torneo (Solo Super Admin)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado correctamente' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async updateTournamentStatus(
    @Param('tournamentId') tournamentId: string,
    @Body('status') status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
  ) {
    return this.adminService.updateTournamentStatus(tournamentId, status);
  }
}
