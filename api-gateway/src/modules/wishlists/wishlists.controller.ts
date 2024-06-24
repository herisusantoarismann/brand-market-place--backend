import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Observable, catchError, throwError } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Controller('')
export class WishlistsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly _productService: ClientProxy,
  ) {}

  @Get('/product/:userId/wishlists')
  findAll(@Param('userId') userId: string): Observable<any> {
    return this._productService
      .send({ cmd: 'find_all_wishlists' }, +userId)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Post('/product/:userId/wishlist')
  create(
    @Param('userId') userId: string,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Observable<any> {
    return this._productService
      .send({ cmd: 'create_wishlist' }, { userId: +userId, createWishlistDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
