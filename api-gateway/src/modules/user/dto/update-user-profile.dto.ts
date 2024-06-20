import { IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @IsString()
  phoneNumber: string;
}
