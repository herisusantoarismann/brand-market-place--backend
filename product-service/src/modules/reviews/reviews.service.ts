import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { IReview } from 'src/shared/interfaces/review.interface';
import { RpcException } from '@nestjs/microservices';
import { UpdateReviewDto } from './dto/update-review.dto';

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

  async findById(productId: number, id: number): Promise<IReview> {
    return this._prisma.review.findUnique({
      where: {
        id,
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

  async update(
    productId: number,
    id: number,
    data: UpdateReviewDto,
  ): Promise<IReview> {
    const review = await this.findById(productId, id);

    if (!review) {
      throw new RpcException(new BadRequestException('Review Not Found'));
    }

    return this._prisma.review.update({
      where: {
        id,
        productId,
      },
      data: {
        content: data.content,
        rating: data.rating,
      },
      select: this.getSelectedProperties(),
    });
  }

  async delete(productId: number, id: number): Promise<IReview> {
    const review = await this.findById(productId, id);

    if (!review) {
      throw new RpcException(new BadRequestException('Review Not Found'));
    }

    return this._prisma.review.delete({
      where: {
        id,
        productId,
      },
      select: this.getSelectedProperties(),
    });
  }
}
