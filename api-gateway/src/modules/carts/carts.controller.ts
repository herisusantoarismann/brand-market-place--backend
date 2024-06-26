import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';

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
}
