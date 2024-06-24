import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        options: {
          host: 'localhost',
          port: 3001,
        },
        transport: Transport.TCP,
      },
    ]),
  ],
  providers: [WishlistsService, PrismaService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
