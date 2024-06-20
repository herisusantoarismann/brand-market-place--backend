import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { CreateAddressBookDto } from './dto/create-address-book.dto';
import { UpdateAddressBookDto } from './dto/update-address-book.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly _userService: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this._userService.connect();
  }

  @Get('/')
  findAll(): Observable<any> {
    return this._userService
      .send({ cmd: 'find_all_user_profile' }, '')
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Post('/')
  create(@Body() createUserProfileDto: CreateUserProfileDto): Observable<any> {
    return this._userService
      .send({ cmd: 'create_user_profile' }, createUserProfileDto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Observable<any> {
    return this._userService
      .send(
        {
          cmd: 'update_user_profile',
        },
        { id: Number(id), data: updateUserProfileDto },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Observable<any> {
    return this._userService
      .send(
        {
          cmd: 'delete_user_profile',
        },
        Number(id),
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Get('/:id/address-books')
  findAllAddressBooks(@Param('id') id: string): Observable<any> {
    return this._userService
      .send({ cmd: 'find_all_address_book' }, +id)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Post('/:id/address-book')
  createUserAddressBook(
    @Param('id') id: string,
    @Body() createAddressBookDto: CreateAddressBookDto,
  ): Observable<any> {
    return this._userService
      .send(
        { cmd: 'create_address_book' },
        { id: +id, data: createAddressBookDto },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Put('/:userId/address-book/:id')
  updateAddressBook(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateAddressBookDto: UpdateAddressBookDto,
  ): Observable<any> {
    return this._userService
      .send(
        {
          cmd: 'update_address_book',
        },
        { id: Number(id), userId: +userId, data: updateAddressBookDto },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Delete('/:userId/address-book/:id')
  deleteAddressBook(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Observable<any> {
    return this._userService
      .send(
        {
          cmd: 'delete_address_book',
        },
        { id: +id, userId: +userId },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
