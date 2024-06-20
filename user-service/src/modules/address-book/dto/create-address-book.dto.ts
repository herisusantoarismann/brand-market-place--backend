export class CreateAddressBookDto {
  userProfileId: number;
  userId: number;
  type: string;
  recipientName: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}
