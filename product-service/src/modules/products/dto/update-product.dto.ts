import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  sizes: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  imageIds: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];
}
