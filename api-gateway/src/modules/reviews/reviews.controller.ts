import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateReviewDto } from './dto/create-review.dto';
import { Observable, catchError, throwError } from 'rxjs';
import { UpdateReviewDto } from './dto/update-review.dto';

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

  @Get('/product/:productId/review/:id')
  find(
    @Param('productId') productId: string,
    @Param('id') id: string,
  ): Observable<any> {
    return this._productService
      .send({ cmd: 'find_review' }, { productId: +productId, id: +id })
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

  @Put('/product/:productId/review/:id')
  update(
    @Param('id') id: string,
    @Param('productId') productId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Observable<any> {
    return this._productService
      .send(
        {
          cmd: 'update_review',
        },
        { id: +id, productId: +productId, data: updateReviewDto },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
