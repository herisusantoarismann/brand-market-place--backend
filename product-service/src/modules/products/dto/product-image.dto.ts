import { IsNotEmpty, IsString } from 'class-validator';

export class ProductImageDto {
  @IsNotEmpty()
  @IsString()
  color: string;
}
