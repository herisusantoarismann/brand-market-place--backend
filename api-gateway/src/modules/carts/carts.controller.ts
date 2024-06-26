import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

@Controller('/')
export class CartsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly _productService: ClientProxy,
  ) {}

  @Get('user/:userId/cart')
  find(@Param('userId') userId: string): Observable<any> {
    return this._productService
      .send({ cmd: 'find_cart' }, +userId)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Post('user/:userId/cart/add')
  findCartItem(
    @Param('userId') userId: string,
    @Body() createCartItemDto: CreateCartItemDto,
  ): Observable<any> {
    return this._productService
      .send({ cmd: 'create_cart_item' }, { userId: +userId, createCartItemDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
