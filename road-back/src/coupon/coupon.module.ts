import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CouponController } from './coupon.controller.js';
import { CouponService } from './coupon.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
  ],
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule { }
