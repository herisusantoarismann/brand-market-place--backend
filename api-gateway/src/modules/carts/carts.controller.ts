import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

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
  createCartItem(
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

  @Patch('user/:userId/cart/:cartItemId')
  updateQuantityCartItem(
    @Param('cartItemId') cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Observable<any> {
    return this._productService
      .send({ cmd: 'update_cart_item' }, { id: +cartItemId, updateCartItemDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Delete('user/:userId/cart/:cartItemId')
  delete(@Param('cartItemId') id: string): Observable<any> {
    return this._productService
      .send(
        {
          cmd: 'delete_cart_item',
        },
        +id,
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
