import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [CartsService, PrismaService],
  controllers: [CartsController],
})
export class CartsModule {}
