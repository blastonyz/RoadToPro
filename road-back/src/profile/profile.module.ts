import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { ProfileController } from './profile.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { BlockchainService } from '../blockchain/blockchain.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [ProfileService, BlockchainService],
  exports: [ProfileService],
})
export class ProfileModule { }
