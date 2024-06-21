import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsService } from './modules/products/products.service';
import { ProductsModule } from './modules/products/products.module';
import { WhislistsModule } from './modules/whislists/whislists.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ProductsModule, WhislistsModule],
  controllers: [AppController],
  providers: [AppService, ProductsService, PrismaService],
})
export class AppModule {}
