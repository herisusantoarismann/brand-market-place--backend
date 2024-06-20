import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AddressBookService } from './address-book.service';
import { CreateAddressBookDto } from './dto/create-address-book.dto';
import { IAddressBook } from 'src/shared/interfaces/address-book.interface';
import { UpdateAddressBookDto } from './dto/update-address-book.dto';

@Controller('address-book')
export class AddressBookController {
  constructor(private readonly _addressBookService: AddressBookService) {}

  @MessagePattern({ cmd: 'find_all_address_book' })
  async findAll(id: number): Promise<{
    success: boolean;
    data: IAddressBook[];
  }> {
    const addressBooks = await this._addressBookService.findAll(id);

    return {
      success: true,
      data: addressBooks,
    };
  }

  @MessagePattern({ cmd: 'create_address_book' })
  async createAddressBook(data: {
    id: number;
    data: CreateAddressBookDto;
  }): Promise<{
    success: boolean;
    data: IAddressBook;
  }> {
    const addressBook = await this._addressBookService.create({
      ...data.data,
      userId: data.id,
    });

    return {
      success: true,
      data: addressBook,
    };
  }

  @MessagePattern({ cmd: 'update_address_book' })
  async updateAddressBook(data: {
    id: number;
    userId: number;
    data: UpdateAddressBookDto;
  }): Promise<{
    success: boolean;
    data: IAddressBook;
  }> {
    const addressBook = await this._addressBookService.update(
      data.id,
      data.userId,
      data.data,
    );

    return {
      success: true,
      data: addressBook,
    };
  }

  // @MessagePattern({
  //   cmd: 'delete_user_profile',
  // })
  // async deleteUserProfile(id: number): Promise<{
  //   success: boolean;
  //   data: any;
  // }> {
  //   const user = await this._userProfileService.delete(id);

  //   return {
  //     success: true,
  //     data: user,
  //   };
  // }
}
