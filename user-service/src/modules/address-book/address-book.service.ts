import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressBookDto } from './dto/create-address-book.dto';
import { IAddressBook } from 'src/shared/interfaces/address-book.interface';
import { PrismaService } from 'src/prisma.service';
import { UpdateAddressBookDto } from './dto/update-address-book.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AddressBookService {
  constructor(private readonly _prisma: PrismaService) {}

  getSelectedProperties() {
    return {
      id: true,
      type: true,
      recipientName: true,
      addressLine: true,
      city: true,
      state: true,
      postalCode: true,
      isDefault: true,
    };
  }

  async findAll(id: number): Promise<IAddressBook[]> {
    console.log(id);
    return this._prisma.addressBook.findMany({
      where: {
        userId: id,
      },
      select: this.getSelectedProperties(),
    });
  }

  async create(
    createAddressBookDto: CreateAddressBookDto,
  ): Promise<IAddressBook> {
    return this._prisma.addressBook.create({
      data: createAddressBookDto,
      select: this.getSelectedProperties(),
    });
  }

  async findById(id: number): Promise<IAddressBook> {
    return this._prisma.addressBook.findUnique({
      where: {
        id: id,
      },
      select: this.getSelectedProperties(),
    });
  }

  async update(
    id: number,
    userId: number,
    data: UpdateAddressBookDto,
  ): Promise<IAddressBook> {
    const addressBook = await this.findById(id);

    if (!addressBook) {
      throw new RpcException(new BadRequestException('Address Book Not Found'));
    }

    return this._prisma.addressBook.update({
      where: {
        id,
        userId: userId,
      },
      data,
      select: this.getSelectedProperties(),
    });
  }

  async delete(id: number, userId: number): Promise<IAddressBook> {
    const addressBook = await this.findById(id);

    if (!addressBook) {
      throw new RpcException(new BadRequestException('Address Book Not Found'));
    }

    return this._prisma.addressBook.delete({
      where: {
        id,
        userId: userId,
      },
      select: this.getSelectedProperties(),
    });
  }
}
