import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber, IsDateString, IsBoolean, IsObject, Min, Max } from 'class-validator';

export class CreatePlayerProfileDto {
  @ApiProperty({ description: 'Nombre público del jugador', example: 'Cristiano Ronaldo' })
  @IsString()
  displayName: string;

  @ApiPropertyOptional({ description: 'Posición del jugador', example: 'Delantero' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ description: 'Número de camiseta', example: 7 })
  @IsInt()
  @Min(1)
  @Max(99)
  @IsOptional()
  jerseyNumber?: number;

  @ApiPropertyOptional({ description: 'Altura en cm', example: 187 })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ description: 'Peso en kg', example: 83 })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Fecha de nacimiento', example: '1985-02-05' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Nacionalidad', example: 'Portugal' })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiPropertyOptional({ description: 'Biografía del jugador' })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiPropertyOptional({ description: 'URL del avatar' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'Estadísticas del jugador', type: 'object' })
  @IsObject()
  @IsOptional()
  statistics?: any;

  @ApiPropertyOptional({ description: 'Logros y premios', type: 'object' })
  @IsObject()
  @IsOptional()
  achievements?: any;
}

export class CreateClubProfileDto {
  @ApiProperty({ description: 'Nombre del club', example: 'Real Madrid CF' })
  @IsString()
  clubName: string;

  @ApiPropertyOptional({ description: 'Nombre corto/siglas', example: 'RMD' })
  @IsString()
  @IsOptional()
  shortName?: string;

  @ApiProperty({ description: 'Símbolo del token (3-5 letras)', example: 'RMD' })
  @IsString()
  tokenSymbol: string;

  @ApiProperty({ description: 'Nombre del token', example: 'Real Madrid Token' })
  @IsString()
  tokenName: string;

  @ApiPropertyOptional({ description: 'Año de fundación', example: 1902 })
  @IsInt()
  @IsOptional()
  foundedYear?: number;

  @ApiPropertyOptional({ description: 'País', example: 'España' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ description: 'Ciudad', example: 'Madrid' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'Estadio', example: 'Santiago Bernabéu' })
  @IsString()
  @IsOptional()
  stadium?: string;

  @ApiPropertyOptional({ description: 'Descripción del club' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'URL del logo' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'URL del banner' })
  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @ApiPropertyOptional({ description: 'Redes sociales', type: 'object' })
  @IsObject()
  @IsOptional()
  socialLinks?: any;
}

export class CreateCoachProfileDto {
  @ApiProperty({ description: 'Nombre del entrenador', example: 'Carlo Ancelotti' })
  @IsString()
  displayName: string;

  @ApiPropertyOptional({ description: 'Especialidad', example: 'Técnico' })
  @IsString()
  @IsOptional()
  specialty?: string;

  @ApiPropertyOptional({ description: 'Nivel de licencia', example: 'UEFA Pro' })
  @IsString()
  @IsOptional()
  licenseLevel?: string;

  @ApiPropertyOptional({ description: 'Años de experiencia', example: 25 })
  @IsInt()
  @IsOptional()
  yearsExperience?: number;

  @ApiPropertyOptional({ description: 'Fecha de nacimiento', example: '1959-06-10' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Nacionalidad', example: 'Italia' })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiPropertyOptional({ description: 'Biografía' })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiPropertyOptional({ description: 'URL del avatar' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'Logros', type: 'object' })
  @IsObject()
  @IsOptional()
  achievements?: any;
}

export class CreateFanProfileDto {
  @ApiProperty({ description: 'Nombre del fan', example: 'Juan Pérez' })
  @IsString()
  displayName: string;

  @ApiPropertyOptional({ description: 'Club favorito', example: 'Real Madrid' })
  @IsString()
  @IsOptional()
  favoriteClub?: string;

  @ApiPropertyOptional({ description: 'Jugador favorito', example: 'Cristiano Ronaldo' })
  @IsString()
  @IsOptional()
  favoritePlayer?: string;

  @ApiPropertyOptional({ description: 'País', example: 'España' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ description: 'URL del avatar' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'Biografía' })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiPropertyOptional({ description: 'Colección de NFTs', type: 'object' })
  @IsObject()
  @IsOptional()
  nftCollection?: any;
}

export class UpdatePlayerProfileDto {
  @ApiPropertyOptional({ description: 'Nombre público del jugador' })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({ description: 'Posición del jugador' })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ description: 'Número de camiseta' })
  @IsInt()
  @Min(1)
  @Max(99)
  @IsOptional()
  jerseyNumber?: number;

  @ApiPropertyOptional({ description: 'Altura en cm' })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ description: 'Peso en kg' })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Biografía del jugador' })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiPropertyOptional({ description: 'URL del avatar' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'Estadísticas del jugador', type: 'object' })
  @IsObject()
  @IsOptional()
  statistics?: any;

  @ApiPropertyOptional({ description: 'Logros y premios', type: 'object' })
  @IsObject()
  @IsOptional()
  achievements?: any;
}

export class RecordPlayerRatingDto {
  @ApiProperty({ description: 'Habilidad técnica (0-100)', example: 72 })
  @IsInt()
  @Min(0)
  @Max(100)
  technical: number;

  @ApiProperty({ description: 'Condición física (0-100)', example: 68 })
  @IsInt()
  @Min(0)
  @Max(100)
  physical: number;

  @ApiProperty({ description: 'Compromiso (0-100)', example: 80 })
  @IsInt()
  @Min(0)
  @Max(100)
  commitment: number;

  @ApiProperty({ description: 'Transparencia (0-100)', example: 90 })
  @IsInt()
  @Min(0)
  @Max(100)
  transparency: number;

  @ApiProperty({ description: 'Reputación (0-100)', example: 75 })
  @IsInt()
  @Min(0)
  @Max(100)
  reputation: number;

  @ApiPropertyOptional({ description: 'Fuente del snapshot', example: 'challenge' })
  @IsString()
  @IsOptional()
  source?: string;
}

export class PlayerLevelResponse {
  @ApiProperty({ description: 'Nivel actual', example: 'PRO' })
  level: 'BASE' | 'PRO' | 'INVERTIBLE' | 'CONTRACT';

  @ApiProperty({ description: 'OL Index actual (0-100)', example: 74 })
  overall: number;

  @ApiProperty({ description: '¿Cumple la regla de ≥70 por 30 días?', example: true })
  sustainedEligibility: boolean;

  @ApiPropertyOptional({ description: 'Fecha desde que se sostiene ≥70', example: '2025-10-01T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  sustainedSince?: string;
}

export class PlayerScoreResponse {
  @ApiProperty({ description: 'Puntaje global (0-100)', example: 78 })
  overall: number;

  @ApiProperty({ description: 'Categoría derivada del puntaje', example: 'Semi-Profesional' })
  category: string;

  @ApiProperty({ description: 'Variación de puntaje vs. hace 7 días', example: 3 })
  deltaWeek: number;

  @ApiProperty({ description: 'Componentes del índice OL (0-100 por componente)' })
  components: {
    technical: number;
    physical: number;
    commitment: number;
    transparency: number;
    reputation: number;
  };
}