import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { IReview } from 'src/shared/interfaces/review.interface';

@Injectable()
export class ReviewsService {
  constructor(private readonly _prisma: PrismaService) {}

  getSelectedProperties() {
    return {
      id: true,
      userId: true,
      content: true,
      rating: true,
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          images: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
    };
  }

  async findAll(productId: number): Promise<IReview[]> {
    return this._prisma.review.findMany({
      where: {
        productId,
      },
      select: this.getSelectedProperties(),
    });
  }

  async create(
    productId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<IReview> {
    return this._prisma.review.create({
      data: {
        userId: createReviewDto.userId,
        content: createReviewDto.content,
        rating: createReviewDto.rating,
        product: {
          connect: {
            id: productId,
          },
        },
      },
      select: this.getSelectedProperties(),
    });
  }
}
