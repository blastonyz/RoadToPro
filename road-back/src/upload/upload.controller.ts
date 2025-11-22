/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  ParseFilePipe,
  MaxFileSizeValidator,
  BadRequestException,
  Logger,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UploadService } from './upload.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { UploadFileDto, UploadPlainDto } from './dto/index.js';

@ApiTags('upload')
@Controller('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) { }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Subir archivo',
    description: 'Sube un archivo de cualquier tipo soportado a Arkiv Network. Tipos soportados: imágenes (jpeg, jpg, png, gif), videos (mp4, avi, mov, wmv, webm, mkv), documentos (pdf, zip, tar, gz), texto (txt, md, csv, log, xml, html, css, js, ts, jsx, tsx), datos (json, yaml, yml, toml, ini, conf, config). Límite: 100MB sin streaming, 500MB con streaming.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir con opciones de configuración',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo a subir',
        },
        description: {
          type: 'string',
          description: 'Descripción del archivo (opcional)',
          example: 'Mi imagen de perfil',
        },
        compress: {
          type: 'boolean',
          description: 'Comprimir archivo (solo imágenes/videos, default: true)',
          default: true,
        },
        enableDashStreaming: {
          type: 'boolean',
          description: 'Convertir a DASH streaming (solo videos, temporalmente deshabilitado)',
          default: false,
        },
        ttl: {
          type: 'number',
          description: 'Tiempo de vida en milisegundos (mínimo 60000ms)',
          minimum: 60000,
          example: 86400000,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo subido exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File uploaded successfully' },
        data: {
          type: 'object',
          properties: {
            fileId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            arkivAddresses: { type: 'array', items: { type: 'string' }, example: ['0xabc123...', '0xdef456...'] },
            totalSize: { type: 'number', example: 1024000 },
            originalSize: { type: 'number', example: 2048000 },
            compressed: { type: 'boolean', example: true },
            chunks: { type: 'number', example: 2 },
            status: { type: 'string', example: 'completed' },
            publicUrl: { type: 'string', example: 'http://localhost:3000/api/data/550e8400-e29b-41d4-a716-446655440000' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Archivo no válido o error de validación' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }), // 100MB max
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @GetUser('id') userId: string,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    try {
      this.logger.log(`User ${userId} uploading file: ${file.originalname}`);

      const result = await this.uploadService.uploadFile(file, userId, {
        description: uploadFileDto.description,
        compress: uploadFileDto.compress,
        enableDashStreaming: uploadFileDto.enableDashStreaming,
        ttl: uploadFileDto.ttl,
      });

      return {
        success: true,
        message: 'File uploaded successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Upload error:', error);
      throw new BadRequestException(
        error.message || 'Failed to upload file',
      );
    }
  }

  @Post('plain')
  @ApiOperation({
    summary: 'Subir datos en texto plano o JSON',
    description: 'Sube datos en texto plano o JSON sin usar form-data. Útil para configuraciones, notas o datos estructurados.',
  })
  @ApiBody({
    type: UploadPlainDto,
    examples: {
      json: {
        summary: 'Datos JSON',
        value: {
          data: { key: 'value', config: { theme: 'dark' } },
          filename: 'config.json',
          description: 'Application configuration',
        },
      },
      text: {
        summary: 'Texto plano',
        value: {
          data: 'Hello World\nThis is plain text',
          filename: 'notes.txt',
          description: 'My notes',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Datos subidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Plain text upload started' },
        data: {
          type: 'object',
          properties: {
            fileId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            originalName: { type: 'string', example: 'config.json' },
            size: { type: 'number', example: 1024 },
            mimeType: { type: 'string', example: 'application/json' },
            status: { type: 'string', example: 'completed' },
            message: { type: 'string', example: 'Upload completed successfully' },
            publicUrl: { type: 'string', example: 'http://localhost:3000/api/data/550e8400-e29b-41d4-a716-446655440000' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'data y filename son requeridos' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async uploadPlainData(
    @GetUser('id') userId: string,
    @Body() uploadPlainDto: UploadPlainDto,
  ) {
    try {
      this.logger.log(`User ${userId} uploading plain data: ${uploadPlainDto.filename}`);

      const result = await this.uploadService.uploadPlainData(
        uploadPlainDto.data,
        uploadPlainDto.filename,
        userId,
        uploadPlainDto.description,
      );

      return {
        success: true,
        message: 'Plain data uploaded successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Upload plain data error:', error);
      throw new BadRequestException(
        error.message || 'Failed to upload plain data',
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Listar archivos del usuario',
    description: 'Lista todos los archivos subidos por el usuario autenticado con información básica y URLs públicas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de archivos del usuario',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
              originalName: { type: 'string', example: 'image.jpg' },
              mimeType: { type: 'string', example: 'image/jpeg' },
              size: { type: 'number', example: 1024000 },
              isDashVideo: { type: 'boolean', example: false },
              createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              expiresAt: { type: 'string', nullable: true, example: null },
              publicUrl: { type: 'string', example: 'http://localhost:3000/api/data/550e8400-e29b-41d4-a716-446655440000' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async listFiles(@GetUser('id') userId: string) {
    try {
      const files = await this.uploadService.listUserFiles(userId);

      return {
        success: true,
        data: files,
      };
    } catch (error) {
      this.logger.error('List files error:', error);
      throw new BadRequestException(
        error.message || 'Failed to list files',
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener información detallada de un archivo',
    description: 'Obtiene información completa de un archivo específico incluyendo chunks, direcciones Arkiv y transacciones.',
  })
  @ApiParam({ name: 'id', description: 'UUID del archivo', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'Información detallada del archivo',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            originalName: { type: 'string', example: 'image.jpg' },
            mimeType: { type: 'string', example: 'image/jpeg' },
            size: { type: 'number', example: 1024000 },
            userId: { type: 'string', example: 'user-uuid' },
            isDashVideo: { type: 'boolean', example: false },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            expiresAt: { type: 'string', nullable: true, example: null },
            chunks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  chunkIndex: { type: 'number' },
                  arkivAddress: { type: 'string' },
                  size: { type: 'number' },
                  txHash: { type: 'string' },
                },
              },
            },
            publicUrl: { type: 'string', example: 'http://localhost:3000/api/data/550e8400-e29b-41d4-a716-446655440000' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async getFile(
    @Param('id') fileId: string,
    @GetUser('id') userId: string,
  ) {
    try {
      const file = await this.uploadService.getFile(fileId, userId);

      return {
        success: true,
        data: file,
      };
    } catch (error) {
      this.logger.error('Get file error:', error);
      throw new BadRequestException(
        error.message || 'Failed to get file',
      );
    }
  }

  @Get(':id/text')
  @ApiOperation({
    summary: 'Obtener contenido de texto de un archivo',
    description: 'Obtiene el contenido de un archivo de texto (.txt, .md, .json, .xml, etc.) como string.',
  })
  @ApiParam({ name: 'id', description: 'UUID del archivo', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'Contenido del archivo de texto',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            fileId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            originalName: { type: 'string', example: 'notes.txt' },
            mimeType: { type: 'string', example: 'text/plain' },
            size: { type: 'number', example: 1024 },
            content: { type: 'string', example: 'Hello World\nThis is plain text' },
            encoding: { type: 'string', example: 'utf-8' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'El archivo no es de tipo texto' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async getTextContent(
    @Param('id') fileId: string,
    @GetUser('id') userId: string,
  ) {
    try {
      const content = await this.uploadService.getTextContent(fileId, userId);

      return {
        success: true,
        data: content,
      };
    } catch (error) {
      this.logger.error('Get text content error:', error);
      throw new BadRequestException(
        error.message || 'Failed to get text content',
      );
    }
  }

  @Get(':id/json')
  @ApiOperation({
    summary: 'Obtener y parsear archivo JSON',
    description: 'Obtiene un archivo JSON y lo parsea automáticamente a un objeto JavaScript.',
  })
  @ApiParam({ name: 'id', description: 'UUID del archivo', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'Contenido JSON parseado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            fileId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            originalName: { type: 'string', example: 'config.json' },
            data: { type: 'object', example: { key: 'value', config: { theme: 'dark' } } },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'El archivo no es JSON o no se puede parsear' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async getJsonContent(
    @Param('id') fileId: string,
    @GetUser('id') userId: string,
  ) {
    try {
      const content = await this.uploadService.getJsonContent(fileId, userId);

      return {
        success: true,
        data: content,
      };
    } catch (error) {
      this.logger.error('Get JSON content error:', error);
      throw new BadRequestException(
        error.message || 'Failed to get JSON content',
      );
    }
  }

  @Get(':id/status')
  @ApiOperation({
    summary: 'Obtener estado de subida de un archivo',
    description: 'Obtiene el estado actual de subida de un archivo incluyendo progreso, chunks y errores.',
  })
  @ApiParam({ name: 'id', description: 'UUID del archivo', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'Estado de subida del archivo',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            fileId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'], example: 'completed' },
            progress: { type: 'number', example: 100 },
            totalChunks: { type: 'number', example: 2 },
            uploadedChunks: { type: 'number', example: 2 },
            failedChunks: { type: 'number', example: 0 },
            retryCount: { type: 'number', example: 0 },
            lastError: { type: 'string', nullable: true, example: null },
            chunks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  chunkIndex: { type: 'number' },
                  status: { type: 'string' },
                  arkivAddress: { type: 'string' },
                  txHash: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async getFileStatus(
    @Param('id') fileId: string,
    @GetUser('id') userId: string,
  ) {
    try {
      const status = await this.uploadService.getFileStatus(fileId, userId);

      return {
        success: true,
        data: status,
      };
    } catch (error) {
      this.logger.error('Get file status error:', error);
      throw new BadRequestException(
        error.message || 'Failed to get file status',
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un archivo',
    description: 'Elimina un archivo específico del usuario autenticado.',
  })
  @ApiParam({ name: 'id', description: 'UUID del archivo', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({
    status: 200,
    description: 'Archivo eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido o ausente' })
  async deleteFile(@Param('id') fileId: string, @GetUser('id') userId: string) {
    try {
      const result = await this.uploadService.deleteFile(fileId, userId);

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      this.logger.error('Delete file error:', error);
      throw new BadRequestException(
        error.message || 'Failed to delete file',
      );
    }
  }
}
