export class UpdateAddressBookDto {
  type: string;
  recipientName: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}
