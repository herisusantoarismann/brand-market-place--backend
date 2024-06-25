import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateReviewDto } from './dto/create-review.dto';
import { Observable, catchError, throwError } from 'rxjs';

@Controller('/')
export class ReviewsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly _productService: ClientProxy,
  ) {}

  @Get('/product/:productId/reviews')
  findAll(@Param('productId') productId: string): Observable<any> {
    return this._productService
      .send({ cmd: 'find_all_reviews' }, +productId)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Post('/product/:productId/review')
  create(
    @Param('productId') productId: number,
    @Body() createReviewDto: CreateReviewDto,
  ): Observable<any> {
    return this._productService
      .send(
        { cmd: 'create_review' },
        { productId: +productId, createReviewDto },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
