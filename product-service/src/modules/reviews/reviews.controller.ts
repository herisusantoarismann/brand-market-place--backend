import { Controller } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateReviewDto } from './dto/create-review.dto';
import { IReview } from 'src/shared/interfaces/review.interface';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly _reviewService: ReviewsService) {}

  @MessagePattern({ cmd: 'create_review' })
  async createBrand(
    @Payload() payload: { productId: number; createReviewDto: CreateReviewDto },
  ): Promise<{
    success: boolean;
    data: IReview;
  }> {
    const { productId, createReviewDto } = payload;

    const review = await this._reviewService.create(
      +productId,
      createReviewDto,
    );

    return {
      success: true,
      data: review,
    };
  }
}
