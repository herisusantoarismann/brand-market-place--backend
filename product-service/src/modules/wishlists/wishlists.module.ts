import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [WishlistsService, PrismaService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
