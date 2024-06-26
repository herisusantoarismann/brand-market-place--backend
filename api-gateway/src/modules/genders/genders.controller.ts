import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateGenderDto } from './dto/create-gender.dto';
import { Observable, catchError, throwError } from 'rxjs';

@Controller('/')
export class GendersController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly _productService: ClientProxy,
  ) {}

  @Get('/genders')
  findAll(): Observable<any> {
    return this._productService
      .send({ cmd: 'find_all_genders' }, '')
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Get('/gender/:id')
  find(@Param('id') id: string): Observable<any> {
    return this._productService
      .send({ cmd: 'find_gender' }, +id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

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
