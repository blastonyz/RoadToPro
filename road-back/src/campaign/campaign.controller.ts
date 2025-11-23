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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CampaignService } from './campaign.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/index.js';
import { UserRole } from '@prisma/client';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear una campaña para un jugador (solo admins y super admins)',
  })
  @ApiResponse({
    status: 201,
    description: 'Campaña creada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para crear campañas',
  })
  @ApiResponse({
    status: 404,
    description: 'Jugador no encontrado',
  })
  async createCampaign(
    @GetUser('id') userId: string,
    @Body() createDto: CreateCampaignDto,
  ) {
    return this.campaignService.createCampaign(userId, createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las campañas (con filtros opcionales)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por estado (DRAFT, ACTIVE, PAUSED, COMPLETED, CANCELLED)',
  })
  @ApiQuery({
    name: 'playerId',
    required: false,
    description: 'Filtrar por ID del jugador',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de campañas',
  })
  async getCampaigns(
    @Query('status') status?: string,
    @Query('playerId') playerId?: string,
  ) {
    return this.campaignService.getCampaigns(status, playerId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una campaña específica por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Campaña encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Campaña no encontrada',
  })
  async getCampaignById(@Param('id') id: string) {
    return this.campaignService.getCampaignById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Actualizar una campaña (solo quien la creó o super admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Campaña actualizada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para editar esta campaña',
  })
  @ApiResponse({
    status: 404,
    description: 'Campaña no encontrada',
  })
  async updateCampaign(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: string,
    @GetUser('isSuperAdmin') isSuperAdmin: boolean,
    @Body() updateDto: UpdateCampaignDto,
  ) {
    return this.campaignService.updateCampaign(
      id,
      userId,
      userRole,
      isSuperAdmin,
      updateDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Eliminar una campaña (solo quien la creó o super admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Campaña eliminada exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para eliminar esta campaña',
  })
  @ApiResponse({
    status: 404,
    description: 'Campaña no encontrada',
  })
  async deleteCampaign(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: string,
    @GetUser('isSuperAdmin') isSuperAdmin: boolean,
  ) {
    return this.campaignService.deleteCampaign(
      id,
      userId,
      userRole,
      isSuperAdmin,
    );
  }

  @Get('player/:playerId')
  @ApiOperation({
    summary: 'Obtener todas las campañas de un jugador específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de campañas del jugador',
  })
  async getPlayerCampaigns(@Param('playerId') playerId: string) {
    return this.campaignService.getPlayerCampaigns(playerId);
  }
}
