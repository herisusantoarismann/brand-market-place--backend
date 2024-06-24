import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateBrandDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  imageId: number;
}
