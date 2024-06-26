import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { PrismaService } from './prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { BrandsModule } from './modules/brands/brands.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { GendersModule } from './modules/genders/genders.module';

@Module({
  imports: [
    ProductsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ConfigModule.forRoot(),
    BrandsModule,
    CategoriesModule,
    WishlistsModule,
    ReviewsModule,
    GendersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
