import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import {
  UpdateUserDto,
  UpdatePlayerProfileDto,
  UpdateClubProfileDto,
  UpdateCoachProfileDto,
  UpdateFanProfileDto,
} from './dto/index.js';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  @ApiOperation({
    summary: 'Obtener información completa del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario obtenida exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async getMyProfile(@GetUser('id') userId: string) {
    return this.userService.getMyProfile(userId);
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar información básica del usuario (nombre, contraseña)',
    description:
      'Permite al usuario actualizar su nombre y/o contraseña. Para cambiar la contraseña, se debe proporcionar la contraseña actual.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Contraseña actual incorrecta',
  })
  async updateUser(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Patch('me/player')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar perfil de jugador',
    description:
      'Permite al usuario actualizar su información de perfil de jugador (nombre, posición, estadísticas, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de jugador actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil de jugador no encontrado',
  })
  async updatePlayerProfile(
    @GetUser('id') userId: string,
    @Body() updateDto: UpdatePlayerProfileDto,
  ) {
    return this.userService.updatePlayerProfile(userId, updateDto);
  }

  @Patch('me/club')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar perfil de club',
    description:
      'Permite al usuario actualizar su información de perfil de club (descripción, logo, redes sociales, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de club actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil de club no encontrado',
  })
  async updateClubProfile(
    @GetUser('id') userId: string,
    @Body() updateDto: UpdateClubProfileDto,
  ) {
    return this.userService.updateClubProfile(userId, updateDto);
  }

  @Patch('me/coach')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar perfil de entrenador',
    description:
      'Permite al usuario actualizar su información de perfil de entrenador (especialidad, licencia, experiencia, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de entrenador actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil de entrenador no encontrado',
  })
  async updateCoachProfile(
    @GetUser('id') userId: string,
    @Body() updateDto: UpdateCoachProfileDto,
  ) {
    return this.userService.updateCoachProfile(userId, updateDto);
  }

  @Patch('me/fan')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar perfil de fan',
    description:
      'Permite al usuario actualizar su información de perfil de fan (club favorito, jugador favorito, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil de fan actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil de fan no encontrado',
  })
  async updateFanProfile(
    @GetUser('id') userId: string,
    @Body() updateDto: UpdateFanProfileDto,
  ) {
    return this.userService.updateFanProfile(userId, updateDto);
  }
}
