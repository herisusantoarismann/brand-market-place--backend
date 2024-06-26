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
import { CreateGenderDto } from './dto/create-gender.dto';
import { Observable, catchError, throwError } from 'rxjs';
import { UpdateGenderDto } from './dto/update-gender.dto';

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

  @Put('/gender/:id')
  update(
    @Param('id') id: string,
    @Body() updateGenderDto: UpdateGenderDto,
  ): Observable<any> {
    return this._productService
      .send(
        {
          cmd: 'update_gender',
        },
        { id: +id, data: updateGenderDto },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
