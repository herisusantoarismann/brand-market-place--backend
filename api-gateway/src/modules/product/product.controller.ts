import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';

@Controller('/')
export class ProductController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly _productService: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this._productService.connect();
  }

  @Get('/products')
  findAll(): Observable<any> {
    return this._productService
      .send({ cmd: 'find_all_product_service' }, '')
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
