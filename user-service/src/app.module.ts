import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserProfileModule } from './modules/user-profile/user-profile.module';
import { AddressBookModule } from './modules/address-book/address-book.module';

@Module({
  imports: [UserProfileModule, AddressBookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
