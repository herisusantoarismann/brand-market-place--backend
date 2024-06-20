import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AddressBookService } from './address-book.service';
import { CreateAddressBookDto } from './dto/create-address-book.dto';
import { IAddressBook } from 'src/shared/interfaces/address-book.interface';

@Controller('address-book')
export class AddressBookController {
  constructor(private readonly _addressBookService: AddressBookService) {}

  @MessagePattern({ cmd: 'create_address_book' })
  async createAddressBook(createAddressBook: CreateAddressBookDto): Promise<{
    success: boolean;
    data: IAddressBook;
  }> {
    console.log(this._addressBookService);
    // const user = await this._userProfileService.create(createUserProfileDto);

    return {
      success: true,
      data: createAddressBook,
    };
  }
}
