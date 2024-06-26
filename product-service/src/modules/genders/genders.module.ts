import { Module } from '@nestjs/common';
import { GendersController } from './genders.controller';
import { GendersService } from './genders.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [GendersController],
  providers: [GendersService, PrismaService],
})
export class GendersModule {}
