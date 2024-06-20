export interface IAddressBook {
  userProfileId?: number;
  type: string;
  recipientName: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}
