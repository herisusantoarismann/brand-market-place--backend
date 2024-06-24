import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [BrandsService, PrismaService],
  controllers: [BrandsController],
})
export class BrandsModule {}
