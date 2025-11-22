import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload.controller.js';
import { DataController } from './data.controller.js';
import { UploadService } from './upload.service.js';
import { ArkaCDNService } from './arka-cdn.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [UploadController, DataController],
  providers: [UploadService, ArkaCDNService],
  exports: [UploadService, ArkaCDNService],
})
export class UploadModule { }
