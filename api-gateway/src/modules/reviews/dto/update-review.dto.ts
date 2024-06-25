import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;
}
