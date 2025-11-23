import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import {
  CreatePlayerProfileDto,
  CreateClubProfileDto,
  CreateCoachProfileDto,
  CreateFanProfileDto,
  UpdatePlayerProfileDto,
} from './dto/index.js';

@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  // ============================================
  // GENERAL ENDPOINTS
  // ============================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los perfiles del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfiles del usuario retornados exitosamente' })
  async getMyProfiles(@Request() req) {
    return this.profileService.getUserProfiles(req.user.id);
  }

  // ============================================
  // PLAYER PROFILE ENDPOINTS
  // ============================================

  @Post('player')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear perfil de jugador' })
  @ApiResponse({ status: 201, description: 'Perfil de jugador creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene un perfil de jugador' })
  async createPlayerProfile(@Request() req, @Body() dto: CreatePlayerProfileDto) {
    return this.profileService.createPlayerProfile(req.user.id, dto);
  }

  @Get('player/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mi perfil de jugador' })
  @ApiResponse({ status: 200, description: 'Perfil de jugador retornado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfil de jugador no encontrado' })
  async getMyPlayerProfile(@Request() req) {
    return this.profileService.getPlayerProfile(req.user.id);
  }

  @Put('player')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar perfil de jugador' })
  @ApiResponse({ status: 200, description: 'Perfil de jugador actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfil de jugador no encontrado' })
  async updatePlayerProfile(@Request() req, @Body() dto: UpdatePlayerProfileDto) {
    return this.profileService.updatePlayerProfile(req.user.id, dto);
  }

  @Post('player/rating')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar snapshot de rating OL del jugador' })
  @ApiResponse({ status: 201, description: 'Snapshot registrado y nivel recalculado' })
  async recordPlayerRating(@Request() req, @Body() body: import('./dto/index.js').RecordPlayerRatingDto) {
    return this.profileService.recordPlayerRating(req.user.id, body);
  }

  @Get('player/level')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener nivel actual del jugador y elegibilidad (≥70 por 30 días)' })
  async getPlayerLevel(@Request() req) {
    return this.profileService.getPlayerLevel(req.user.id);
  }

  @Get('player/rating-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Historial de rating OL del jugador' })
  async getPlayerRatingHistory(
    @Request() req,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: number,
  ) {
    return this.profileService.getPlayerRatingHistory(req.user.id, { from, to, limit: limit ? Number(limit) : undefined });
  }

  @Get('player/score')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Puntaje actual del jugador para dashboard (overall, categoría, delta semanal, componentes)' })
  async getPlayerScore(@Request() req) {
    return this.profileService.getPlayerScore(req.user.id);
  }

  @Get('players')
  @ApiOperation({ summary: 'Listar todos los jugadores' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Número de registros a saltar' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Número de registros a retornar' })
  @ApiResponse({ status: 200, description: 'Lista de jugadores retornada exitosamente' })
  async getAllPlayers(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.profileService.getAllPlayers(skip, take);
  }

  @Put('player/nft')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar información del NFT del jugador' })
  @ApiResponse({ status: 200, description: 'Información del NFT actualizada exitosamente' })
  async updatePlayerNFT(
    @Request() req,
    @Body() body: { nftTokenId: string; contractAddress: string },
  ) {
    return this.profileService.updatePlayerNFTInfo(
      req.user.id,
      body.nftTokenId,
      body.contractAddress,
    );
  }

  // ============================================
  // CLUB PROFILE ENDPOINTS
  // ============================================

  @Post('club')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear perfil de club' })
  @ApiResponse({ status: 201, description: 'Perfil de club creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene un perfil de club o el nombre/símbolo está tomado' })
  async createClubProfile(@Request() req, @Body() dto: CreateClubProfileDto) {
    return this.profileService.createClubProfile(req.user.id, dto);
  }

  @Get('club/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mi perfil de club' })
  @ApiResponse({ status: 200, description: 'Perfil de club retornado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfil de club no encontrado' })
  async getMyClubProfile(@Request() req) {
    return this.profileService.getClubProfile(req.user.id);
  }

  @Get('clubs')
  @ApiOperation({ summary: 'Listar todos los clubes' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de clubes retornada exitosamente' })
  async getAllClubs(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.profileService.getAllClubs(skip, take);
  }

  @Get('club/:clubName')
  @ApiOperation({ summary: 'Obtener club por nombre' })
  @ApiParam({ name: 'clubName', description: 'Nombre del club' })
  @ApiResponse({ status: 200, description: 'Club encontrado' })
  @ApiResponse({ status: 404, description: 'Club no encontrado' })
  async getClubByName(@Param('clubName') clubName: string) {
    return this.profileService.getClubByName(clubName);
  }

  @Put('club/token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar información del token del club' })
  @ApiResponse({ status: 200, description: 'Información del token actualizada exitosamente' })
  async updateClubToken(
    @Request() req,
    @Body() body: { tokenAddress: string; tokenSupply: string },
  ) {
    return this.profileService.updateClubTokenInfo(
      req.user.id,
      body.tokenAddress,
      body.tokenSupply,
    );
  }

  // ============================================
  // COACH PROFILE ENDPOINTS
  // ============================================

  @Post('coach')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear perfil de entrenador' })
  @ApiResponse({ status: 201, description: 'Perfil de entrenador creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene un perfil de entrenador' })
  async createCoachProfile(@Request() req, @Body() dto: CreateCoachProfileDto) {
    return this.profileService.createCoachProfile(req.user.id, dto);
  }

  @Get('coach/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mi perfil de entrenador' })
  @ApiResponse({ status: 200, description: 'Perfil de entrenador retornado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfil de entrenador no encontrado' })
  async getMyCoachProfile(@Request() req) {
    return this.profileService.getCoachProfile(req.user.id);
  }

  // ============================================
  // FAN PROFILE ENDPOINTS
  // ============================================

  @Post('fan')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear perfil de fan' })
  @ApiResponse({ status: 201, description: 'Perfil de fan creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene un perfil de fan' })
  async createFanProfile(@Request() req, @Body() dto: CreateFanProfileDto) {
    return this.profileService.createFanProfile(req.user.id, dto);
  }

  @Get('fan/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mi perfil de fan' })
  @ApiResponse({ status: 200, description: 'Perfil de fan retornado exitosamente' })
  @ApiResponse({ status: 404, description: 'Perfil de fan no encontrado' })
  async getMyFanProfile(@Request() req) {
    return this.profileService.getFanProfile(req.user.id);
  }

  @Put('fan/loyalty')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar puntos de lealtad del fan' })
  @ApiResponse({ status: 200, description: 'Puntos de lealtad actualizados exitosamente' })
  async updateFanLoyalty(@Request() req, @Body() body: { points: number }) {
    return this.profileService.updateFanLoyaltyPoints(req.user.id, body.points);
  }

  // ============================================
  // DELETE ENDPOINTS
  // ============================================

  @Delete(':type')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar perfil' })
  @ApiParam({ name: 'type', enum: ['player', 'club', 'coach', 'fan'] })
  @ApiResponse({ status: 204, description: 'Perfil eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'Tipo de perfil inválido' })
  async deleteProfile(
    @Request() req,
    @Param('type') type: 'player' | 'club' | 'coach' | 'fan',
  ) {
    return this.profileService.deleteProfile(req.user.id, type);
  }
}
