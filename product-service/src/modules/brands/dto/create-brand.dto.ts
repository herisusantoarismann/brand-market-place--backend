import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  imageId: number;
}
