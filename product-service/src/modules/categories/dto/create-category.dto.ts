import { IsNotEmpty, IsNumber, IsString, isNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  imageId: number;
}
