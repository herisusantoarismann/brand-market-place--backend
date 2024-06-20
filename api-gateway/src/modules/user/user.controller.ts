import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.userService.connect();
  }

  @Get('/')
  findAll(): Observable<any> {
    return this.userService
      .send({ cmd: 'find_all_user_profile' }, '')
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Post('/')
  create(@Body() createUserProfileDto: CreateUserProfileDto): Observable<any> {
    return this.userService
      .send({ cmd: 'create_user_profile' }, createUserProfileDto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
