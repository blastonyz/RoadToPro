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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import { ChallengeService } from './challenge.service.js';
import { CreateChallengeDto } from './dto/create-challenge.dto.js';
import { UpdateChallengeDto } from './dto/update-challenge.dto.js';
import { CreateSubmissionDto } from './dto/create-submission.dto.js';
import { UpdateSubmissionDto } from './dto/update-submission.dto.js';
import { ChallengeFilterDto } from './dto/challenge-filter.dto.js';
import { VoteSubmissionDto, VoteDirection } from './dto/vote-submission.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) { }

  // ============================================
  // ENDPOINTS DE RETOS
  // ============================================

  @Post()
  @ApiTags('challenges')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Crear nuevo reto',
    description: 'Crea un nuevo reto temporal con título, descripción, dificultad y duración. Solo administradores.'
  })
  @ApiBody({ type: CreateChallengeDto })
  @ApiResponse({ status: 201, description: 'Reto creado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() dto: CreateChallengeDto) {
    return this.challengeService.create(dto);
  }

  @Get()
  @ApiTags('challenges')
  @ApiOperation({
    summary: 'Listar todos los retos',
    description: 'Obtiene todos los retos con filtros opcionales de estado y dificultad'
  })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'COMPLETED', 'EXPIRED'], description: 'Estado del reto' })
  @ApiQuery({ name: 'difficulty', required: false, enum: ['EASY', 'MEDIUM', 'HARD', 'EXTREME'], description: 'Dificultad del reto' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Resultados por página' })
  @ApiResponse({ status: 200, description: 'Lista de retos obtenida exitosamente' })
  async findAll(@Query() filters: ChallengeFilterDto) {
    return this.challengeService.findAll(filters);
  }

  @Get('active')
  @ApiTags('challenges')
  @ApiOperation({
    summary: 'Obtener retos activos',
    description: 'Lista únicamente los retos con estado ACTIVE que aún están dentro de su periodo de participación'
  })
  @ApiResponse({ status: 200, description: 'Retos activos obtenidos exitosamente' })
  async findActive() {
    return this.challengeService.findActive();
  }

  @Get('submissions')
  @ApiTags('submissions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener totas las participaciones',
    description: 'Lista todas las participaciones de los usuarios en cualquier reto'
  })
  @ApiResponse({ status: 200, description: 'Lista de participaciones obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findSubmissions(@Request() req) {
    return this.challengeService.findSubmissions();
  }
  
  @Get(':id')
  @ApiTags('challenges')
  @ApiOperation({
    summary: 'Obtener reto específico',
    description: 'Obtiene los detalles completos de un reto por su ID, incluyendo participaciones'
  })
  @ApiParam({ name: 'id', description: 'ID del reto' })
  @ApiResponse({ status: 200, description: 'Reto encontrado' })
  @ApiResponse({ status: 404, description: 'Reto no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.challengeService.findOne(id);
  }

  @Patch(':id')
  @ApiTags('challenges')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Actualizar reto',
    description: 'Actualiza la información de un reto existente. Solo administradores.'
  })
  @ApiParam({ name: 'id', description: 'ID del reto' })
  @ApiBody({ type: UpdateChallengeDto })
  @ApiResponse({ status: 200, description: 'Reto actualizado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Reto no encontrado' })
  async update(@Param('id') id: string, @Body() dto: UpdateChallengeDto) {
    return this.challengeService.update(id, dto);
  }

  @Delete(':id')
  @ApiTags('challenges')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Eliminar reto',
    description: 'Elimina un reto del sistema. Solo administradores.'
  })
  @ApiParam({ name: 'id', description: 'ID del reto' })
  @ApiResponse({ status: 200, description: 'Reto eliminado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Reto no encontrado' })
  async remove(@Param('id') id: string) {
    return this.challengeService.remove(id);
  }

  // ============================================
  // ENDPOINTS DE PARTICIPACIONES
  // ============================================

  @Post('submissions')
  @ApiTags('submissions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Enviar participación a un reto',
    description: 'Permite a un usuario enviar su participación con video a un reto activo usando Arka CDN'
  })
  @ApiBody({ type: CreateSubmissionDto })
  @ApiResponse({ status: 201, description: 'Participación enviada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 400, description: 'Ya participó en este reto o reto no activo' })
  async createSubmission(@Request() req, @Body() dto: CreateSubmissionDto) {
    return this.challengeService.createSubmission(req.user.id, dto);
  }

  @Get('submissions/my')
  @ApiTags('submissions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener mis participaciones',
    description: 'Lista todas las participaciones del usuario autenticado en cualquier reto'
  })
  @ApiResponse({ status: 200, description: 'Lista de participaciones obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findMySubmissions(@Request() req) {
    return this.challengeService.findUserSubmissions(req.user.id);
  }

  @Get(':id/submissions')
  @ApiTags('submissions')
  @ApiOperation({
    summary: 'Obtener participaciones de un reto',
    description: 'Lista todas las participaciones enviadas a un reto específico'
  })
  @ApiParam({ name: 'id', description: 'ID del reto' })
  @ApiResponse({ status: 200, description: 'Participaciones obtenidas exitosamente' })
  @ApiResponse({ status: 404, description: 'Reto no encontrado' })
  async findChallengeSubmissions(@Param('id') id: string) {
    return this.challengeService.findChallengeSubmissions(id);
  }

  @Get('submissions/:id')
  @ApiTags('submissions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtener participación específica',
    description: 'Obtiene los detalles de una participación por su ID'
  })
  @ApiParam({ name: 'id', description: 'ID de la participación' })
  @ApiResponse({ status: 200, description: 'Participación encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Participación no encontrada' })
  async findSubmission(@Param('id') id: string) {
    return this.challengeService.findSubmission(id);
  }

  @Patch('submissions/:id')
  @ApiTags('submissions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Actualizar participación',
    description: 'Actualiza el estado de una participación (aprobar/rechazar). Solo administradores.'
  })
  @ApiParam({ name: 'id', description: 'ID de la participación' })
  @ApiBody({ type: UpdateSubmissionDto })
  @ApiResponse({ status: 200, description: 'Participación actualizada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Participación no encontrada' })
  async updateSubmission(
    @Param('id') id: string,
    @Body() dto: UpdateSubmissionDto,
  ) {
    return this.challengeService.updateSubmission(id, dto);
  }

  @Delete('submissions/:id')
  @ApiTags('submissions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Eliminar participación',
    description: 'Elimina una participación del usuario autenticado'
  })
  @ApiParam({ name: 'id', description: 'ID de la participación' })
  @ApiResponse({ status: 200, description: 'Participación eliminada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Participación no encontrada' })
  async removeSubmission(@Param('id') id: string, @Request() req) {
    return this.challengeService.removeSubmission(id, req.user.id);
  }

  @Post('submissions/:id/vote')
  @ApiTags('submissions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Votar participación (pulgar arriba/abajo)',
    description: 'Permite votar una participación. Repetir el mismo voto la quita (toggle).'
  })
  @ApiParam({ name: 'id', description: 'ID de la participación' })
  @ApiBody({ type: VoteSubmissionDto })
  @ApiResponse({ status: 200, description: 'Voto registrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async voteSubmission(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: VoteSubmissionDto,
  ) {
    const value = dto.value === VoteDirection.UP ? 1 : -1;
    return this.challengeService.voteSubmission(req.user.id, id, value);
  }

  @Get('submissions/:id/votes')
  @ApiTags('submissions')
  @ApiOperation({
    summary: 'Obtener conteos de votos de una participación',
    description: 'Devuelve up, down y score acumulado.'
  })
  @ApiParam({ name: 'id', description: 'ID de la participación' })
  @ApiResponse({ status: 200, description: 'Conteos obtenidos' })
  async getSubmissionVotes(@Param('id') id: string) {
    return this.challengeService.getSubmissionVotes(id);
  }
}
