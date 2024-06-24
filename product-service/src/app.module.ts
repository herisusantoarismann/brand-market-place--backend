import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsService } from './modules/products/products.service';
import { ProductsModule } from './modules/products/products.module';
import { WhislistsModule } from './modules/whislists/whislists.module';
import { PrismaService } from './prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { BrandsModule } from './modules/brands/brands.module';

@Module({
  imports: [
    ProductsModule,
    WhislistsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ConfigModule.forRoot(),
    BrandsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProductsService, PrismaService],
})
export class AppModule {}
