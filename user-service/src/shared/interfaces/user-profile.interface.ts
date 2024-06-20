import { IAddressBook } from './address-book.interface';

export interface IUserProfile {
  userId: number;
  phoneNumber?: string;
  addressBooks?: IAddressBook[];
}
