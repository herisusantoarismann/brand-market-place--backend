import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationErrorsInterceptor } from './shared/exceptions/validation.exception';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, ProductModule, BrandsModule, CategoriesModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ValidationErrorsInterceptor,
    },
  ],
})
export class AppModule {}
