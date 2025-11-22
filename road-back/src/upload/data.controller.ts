import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UploadService } from './upload.service.js';

@ApiTags('data')
@Controller('data')
export class DataController {
  private readonly logger = new Logger(DataController.name);

  constructor(private readonly uploadService: UploadService) { }

  /**
   * Public endpoint to access files by UUID
   * This endpoint does not require authentication
   */
  @Get(':uuid')
  @ApiOperation({
    summary: '⚠️ ENDPOINT PÚBLICO - Descargar archivo por UUID',
    description: `Descarga un archivo directamente usando su UUID. El archivo se retorna como datos binarios con el Content-Type apropiado.
    
ℹ️ Este endpoint NO requiere autenticación y es accesible públicamente.

Uso en HTML:
- Imágenes: <img src="http://localhost:3000/api/data/{uuid}" />
- Videos: <video controls><source src="http://localhost:3000/api/data/{uuid}" /></video>
- Descarga: <a href="http://localhost:3000/api/data/{uuid}" download>Descargar</a>

Headers de respuesta:
- Content-Type: tipo MIME del archivo
- Content-Length: tamaño en bytes
- Content-Disposition: inline; filename="nombre_original"
- Cache-Control: public, max-age=31536000, immutable`,
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID del archivo',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo retornado como datos binarios',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'image/jpeg': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'video/mp4': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
      'application/json': {
        schema: {
          type: 'object',
        },
      },
      'text/plain': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Archivo no encontrado o UUID inválido',
  })
  @ApiResponse({
    status: 500,
    description: 'Error al recuperar el archivo de Arkiv Network',
  })
  async getPublicFile(
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`Accessing public file: ${uuid}`);

      // Get file info from database (including mimeType for proper headers)
      const publicUrl = await this.uploadService.getPublicUrl(uuid);

      // Download the file from Arka CDN
      const fileBuffer = await this.uploadService.downloadFile(uuid);

      // Set appropriate headers
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Content-Length', fileBuffer.length);

      // Send the file
      res.send(fileBuffer);
    } catch (error) {
      this.logger.error('Get public file error:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('File not found');
    }
  }
}
