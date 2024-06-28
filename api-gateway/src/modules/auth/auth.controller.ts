import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.authService.connect();
  }

  @Post('/register')
  register(@Body() registerDto: RegisterDto): Observable<any> {
    return this.authService
      .send({ cmd: 'register' }, registerDto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @HttpCode(200)
  @Post('/login')
  login(@Body() loginDto: LoginDto): Observable<any> {
    return this.authService
      .send({ cmd: 'login' }, loginDto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
