import { Controller } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateReviewDto } from './dto/create-review.dto';
import { IReview } from 'src/shared/interfaces/review.interface';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly _reviewService: ReviewsService) {}

  @MessagePattern({ cmd: 'find_all_reviews' })
  async findAll(productId: number): Promise<{
    success: boolean;
    data: IReview[];
  }> {
    const reviews = await this._reviewService.findAll(+productId);

    return {
      success: true,
      data: reviews,
    };
  }

  @MessagePattern({ cmd: 'find_review' })
  async find(@Payload() payload: { productId: number; id: number }): Promise<{
    success: boolean;
    data: IReview;
  }> {
    const { productId, id } = payload;

    const product = await this._reviewService.findById(+productId, +id);

    return {
      success: true,
      data: product,
    };
  }

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

  @MessagePattern({ cmd: 'update_review' })
  async updateBrand(
    @Payload()
    payload: {
      productId: number;
      id: number;
      data: UpdateReviewDto;
    },
  ): Promise<{
    success: boolean;
    data: IReview;
  }> {
    const { productId, id, data } = payload;

    const review = await this._reviewService.update(productId, id, data);

    return {
      success: true,
      data: review,
    };
  }

  @MessagePattern({
    cmd: 'delete_review',
  })
  async delete(@Payload() payload: { productId: number; id: number }): Promise<{
    success: boolean;
    data: IReview;
  }> {
    const { productId, id } = payload;

    const review = await this._reviewService.delete(+productId, +id);

    return {
      success: true,
      data: review,
    };
  }
}
