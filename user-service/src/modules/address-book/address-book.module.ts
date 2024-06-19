import { Module } from '@nestjs/common';
import { AddressBookController } from './address-book.controller';
import { AddressBookService } from './address-book.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AddressBookController],
  providers: [AddressBookService, PrismaService],
})
export class AddressBookModule {}
