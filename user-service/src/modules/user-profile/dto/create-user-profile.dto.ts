import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsString()
  phoneNumber: string;
}
