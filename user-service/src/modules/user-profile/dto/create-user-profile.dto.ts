import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsString()
  @IsOptional()
  phoneNumber?: string | null;
}
