import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateGenderDto } from './dto/create-gender.dto';
import { Observable, catchError, throwError } from 'rxjs';

@Controller('/')
export class GendersController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly _productService: ClientProxy,
  ) {}

  @Post('/gender')
  create(@Body() createGenderDto: CreateGenderDto): Observable<any> {
    return this._productService
      .send({ cmd: 'create_gender' }, createGenderDto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
