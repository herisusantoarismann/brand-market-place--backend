import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  imageIds: number[];
}
