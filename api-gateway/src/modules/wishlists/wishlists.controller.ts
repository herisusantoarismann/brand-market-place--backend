import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Observable, catchError, throwError } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Controller('')
export class WishlistsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly _productService: ClientProxy,
  ) {}

  @Post('/wishlist')
  create(@Body() createWishlistDto: CreateWishlistDto): Observable<any> {
    return this._productService
      .send({ cmd: 'create_wishlist' }, createWishlistDto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
