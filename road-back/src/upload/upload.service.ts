import { Injectable, Logger, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ArkaCDNService } from './arka-cdn.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { FileStatus } from '@prisma/client';

@Injectable()
export class UploadService implements OnModuleInit {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private arkaCDN: ArkaCDNService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) { }

  async onModuleInit() {
    try {
      // Authenticate with Arka CDN using environment credentials
      const email = this.configService.get<string>('ARKA_CDN_EMAIL');
      const password = this.configService.get<string>('ARKA_CDN_PASSWORD');
      const walletAddress = this.configService.get<string>('ARKA_CDN_WALLET');

      if (walletAddress) {
        await this.arkaCDN.loginWithWallet(walletAddress);
        this.logger.log('Authenticated with Arka CDN using wallet');
      } else if (email && password) {
        await this.arkaCDN.login(email, password);
        this.logger.log('Authenticated with Arka CDN using email/password');
      } else {
        this.logger.warn('No Arka CDN credentials found. Authentication required before upload.');
      }
    } catch (error) {
      this.logger.error('Failed to authenticate with Arka CDN:', error);
      throw error;
    }
  }

  /**
   * Upload a file to Arka CDN and save to database
   */
  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    options?: {
      description?: string;
      compress?: boolean;
      enableDashStreaming?: boolean;
      ttl?: number;
    },
  ) {
    this.logger.log(
      `Uploading file: ${file.originalname}, size: ${file.size} bytes, type: ${file.mimetype}`,
    );

    // Subir a Arka CDN
    const result = await this.arkaCDN.uploadFile(file, options);
    const arkaData = result.data;

    // Calcular fecha de expiración si hay TTL
    const expiresAt = options?.ttl ? new Date(Date.now() + options.ttl) : null;

    // Guardar en base de datos
    const savedFile = await this.prisma.file.create({
      data: {
        arkaFileId: arkaData.fileId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: arkaData.totalSize || file.size,
        description: options?.description,
        publicUrl: arkaData.publicUrl ?? '',
        status: this.mapArkaStatus(arkaData.status),
        compressed: arkaData.compressed || false,
        isDashVideo: false,
        totalChunks: arkaData.chunks || 0,
        uploadedChunks: arkaData.chunks || 0,
        progress: arkaData.status === 'completed' ? 100 : 0,
        originalSize: arkaData.originalSize,
        expiresAt,
        userId,
        chunks: {
          create: (arkaData.arkivAddresses || []).map((address, index) => ({
            chunkIndex: index,
            arkivAddress: address,
            size: Math.ceil(arkaData.totalSize / (arkaData.arkivAddresses?.length || 1)),
            status: 'completed',
          })),
        },
      },
      include: {
        chunks: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            wallets: {
              select: {
                id: true,
                address: true,
                network: true,
                currency: true,
                provider: true,
                isDefault: true,
              },
            },
          },
        },
      },
    });

    this.logger.log(`File saved to database: ${savedFile.id}`);

    return {
      id: savedFile.id,
      arkaFileId: savedFile.arkaFileId,
      originalName: savedFile.originalName,
      mimeType: savedFile.mimeType,
      size: savedFile.size,
      publicUrl: savedFile.publicUrl,
      status: savedFile.status,
      compressed: savedFile.compressed,
      chunks: savedFile.totalChunks,
      createdAt: savedFile.createdAt,
      expiresAt: savedFile.expiresAt,
      user: {
        id: savedFile.user.id,
        email: savedFile.user.email,
        name: savedFile.user.name,
        wallets: savedFile.user.wallets,
      },
    };
  }

  /**
   * Upload plain text or JSON data and save to database
   */
  async uploadPlainData(
    data: string | object,
    filename: string,
    userId: string,
    description?: string,
  ) {
    this.logger.log(`Uploading plain data: ${filename}`);

    // Subir a Arka CDN
    const result = await this.arkaCDN.uploadPlainData(data, filename, description);
    const arkaData = result.data;

    // Guardar en base de datos
    const savedFile = await this.prisma.file.create({
      data: {
        arkaFileId: arkaData.fileId,
        originalName: arkaData.originalName || filename,
        mimeType: arkaData.mimeType || 'text/plain',
        size: arkaData.size,
        description,
        publicUrl: arkaData.publicUrl ?? '',
        status: this.mapArkaStatus(arkaData.status),
        compressed: false,
        isDashVideo: false,
        totalChunks: 1,
        uploadedChunks: 1,
        progress: arkaData.status === 'completed' ? 100 : 0,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            wallets: {
              select: {
                id: true,
                address: true,
                network: true,
                currency: true,
                provider: true,
                isDefault: true,
              },
            },
          },
        },
      },
    });

    this.logger.log(`Plain data saved to database: ${savedFile.id}`);

    return {
      id: savedFile.id,
      arkaFileId: savedFile.arkaFileId,
      originalName: savedFile.originalName,
      mimeType: savedFile.mimeType,
      size: savedFile.size,
      publicUrl: savedFile.publicUrl,
      status: savedFile.status,
      message: arkaData.message,
      user: {
        id: savedFile.user.id,
        email: savedFile.user.email,
        name: savedFile.user.name,
        wallets: savedFile.user.wallets,
      },
    };
  }

  /**
   * List all files for the authenticated user from database
   */
  async listUserFiles(userId: string) {
    const files = await this.prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        arkaFileId: true,
        originalName: true,
        mimeType: true,
        size: true,
        publicUrl: true,
        status: true,
        compressed: true,
        isDashVideo: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    return files;
  }

  /**
   * Get detailed file information
   * Si el status es PENDING, consulta Arka CDN para actualizar
   */
  async getFile(fileId: string, userId: string) {
    // Buscar en base de datos
    const file = await this.prisma.file.findFirst({
      where: { id: fileId, userId },
      include: { chunks: true },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Si el estado es PENDING o PROCESSING, consultar Arka CDN para actualizar
    if (file.status === FileStatus.PENDING || file.status === FileStatus.PROCESSING) {
      try {
        this.logger.log(`File ${fileId} is ${file.status}, checking Arka CDN for updates...`);
        const arkaStatus = await this.arkaCDN.getFileStatus(file.arkaFileId);

        // Actualizar en base de datos
        const updatedFile = await this.updateFileStatus(file.id, arkaStatus.data);

        return {
          ...updatedFile,
          chunks: updatedFile.chunks.map((chunk) => ({
            id: chunk.id,
            chunkIndex: chunk.chunkIndex,
            arkivAddress: chunk.arkivAddress,
            size: chunk.size,
            status: chunk.status,
            txHash: chunk.txHash,
          })),
        };
      } catch (error) {
        this.logger.error(`Failed to update file status from Arka CDN: ${error.message}`);
        // Retornar lo que tenemos en BD aunque falle la actualización
      }
    }

    return {
      id: file.id,
      arkaFileId: file.arkaFileId,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      description: file.description,
      publicUrl: file.publicUrl,
      status: file.status,
      compressed: file.compressed,
      isDashVideo: file.isDashVideo,
      progress: file.progress,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      expiresAt: file.expiresAt,
      chunks: file.chunks.map((chunk) => ({
        id: chunk.id,
        chunkIndex: chunk.chunkIndex,
        arkivAddress: chunk.arkivAddress,
        size: chunk.size,
        status: chunk.status,
        txHash: chunk.txHash,
      })),
    };
  }

  /**
   * Get text content from a file
   */
  async getTextContent(fileId: string, userId: string) {
    const file = await this.prisma.file.findFirst({
      where: { id: fileId, userId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (!file.mimeType.startsWith('text/') && !file.mimeType.includes('json')) {
      throw new BadRequestException('File is not a text file');
    }

    const result = await this.arkaCDN.getTextContent(file.arkaFileId);
    return result.data;
  }

  /**
   * Get JSON content from a file
   */
  async getJsonContent(fileId: string, userId: string) {
    const file = await this.prisma.file.findFirst({
      where: { id: fileId, userId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (!file.mimeType.includes('json')) {
      throw new BadRequestException('File is not a JSON file');
    }

    const result = await this.arkaCDN.getJsonContent(file.arkaFileId);
    return result.data;
  }

  /**
   * Delete a file from Arka CDN and database
   */
  async deleteFile(fileId: string, userId: string) {
    const file = await this.prisma.file.findFirst({
      where: { id: fileId, userId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Eliminar de Arka CDN
    try {
      await this.arkaCDN.deleteFile(file.arkaFileId);
    } catch (error) {
      this.logger.error(`Failed to delete from Arka CDN: ${error.message}`);
      // Continuar con la eliminación de BD aunque falle en Arka
    }

    // Eliminar de base de datos (cascade eliminará chunks)
    await this.prisma.file.delete({
      where: { id: fileId },
    });

    return { message: 'File deleted successfully' };
  }

  /**
   * Get file upload status
   * Si está en PENDING/PROCESSING, consulta Arka CDN para actualizar
   */
  async getFileStatus(fileId: string, userId: string) {
    const file = await this.prisma.file.findFirst({
      where: { id: fileId, userId },
      include: { chunks: true },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Si el estado es PENDING o PROCESSING, consultar Arka CDN
    if (file.status === FileStatus.PENDING || file.status === FileStatus.PROCESSING) {
      try {
        this.logger.log(`Checking Arka CDN for status update of file ${fileId}...`);
        const arkaStatus = await this.arkaCDN.getFileStatus(file.arkaFileId);

        // Actualizar en base de datos
        const updatedFile = await this.updateFileStatus(file.id, arkaStatus.data);

        return {
          fileId: updatedFile.id,
          arkaFileId: updatedFile.arkaFileId,
          status: updatedFile.status,
          progress: updatedFile.progress,
          totalChunks: updatedFile.totalChunks,
          uploadedChunks: updatedFile.uploadedChunks,
          failedChunks: updatedFile.failedChunks,
          retryCount: updatedFile.retryCount,
          lastError: updatedFile.lastError,
          chunks: updatedFile.chunks,
        };
      } catch (error) {
        this.logger.error(`Failed to get status from Arka CDN: ${error.message}`);
        // Retornar lo que tenemos en BD
      }
    }

    return {
      fileId: file.id,
      arkaFileId: file.arkaFileId,
      status: file.status,
      progress: file.progress,
      totalChunks: file.totalChunks,
      uploadedChunks: file.uploadedChunks,
      failedChunks: file.failedChunks,
      retryCount: file.retryCount,
      lastError: file.lastError,
      chunks: file.chunks.map((chunk) => ({
        chunkIndex: chunk.chunkIndex,
        status: chunk.status,
        arkivAddress: chunk.arkivAddress,
        txHash: chunk.txHash,
      })),
    };
  }

  /**
   * Get public URL for a file by arkaFileId
   */
  async getPublicUrl(arkaFileId: string): Promise<string> {
    const file = await this.prisma.file.findUnique({
      where: { arkaFileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file.publicUrl;
  }

  /**
   * Download file content directly
   */
  async downloadFile(arkaFileId: string) {
    return await this.arkaCDN.downloadFile(arkaFileId);
  }

  /**
   * Helper: Mapear status de Arka CDN a nuestro enum
   */
  private mapArkaStatus(arkaStatus: string): FileStatus {
    const statusMap: Record<string, FileStatus> = {
      pending: FileStatus.PENDING,
      processing: FileStatus.PROCESSING,
      completed: FileStatus.COMPLETED,
      failed: FileStatus.FAILED,
    };

    return statusMap[arkaStatus.toLowerCase()] || FileStatus.PENDING;
  }

  /**
   * Helper: Actualizar estado del archivo desde Arka CDN
   */
  private async updateFileStatus(fileId: string, arkaStatus: any) {
    const status = this.mapArkaStatus(arkaStatus.status);

    // Actualizar archivo
    const updatedFile = await this.prisma.file.update({
      where: { id: fileId },
      data: {
        status,
        progress: arkaStatus.progress || 0,
        uploadedChunks: arkaStatus.uploadedChunks || 0,
        failedChunks: arkaStatus.failedChunks || 0,
        retryCount: arkaStatus.retryCount || 0,
        lastError: arkaStatus.lastError,
        updatedAt: new Date(),
      },
      include: { chunks: true },
    });

    // Actualizar chunks si hay información
    if (arkaStatus.chunks && Array.isArray(arkaStatus.chunks)) {
      for (const chunkData of arkaStatus.chunks) {
        await this.prisma.fileChunk.updateMany({
          where: {
            fileId,
            chunkIndex: chunkData.chunkIndex,
          },
          data: {
            status: chunkData.status,
            arkivAddress: chunkData.arkivAddress || '',
            txHash: chunkData.txHash,
            updatedAt: new Date(),
          },
        });
      }
    }

    return updatedFile;
  }
}

