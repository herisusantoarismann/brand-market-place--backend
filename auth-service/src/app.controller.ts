import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { RegisterDto } from './shared/dto/register.dto';
import { IUser } from './shared/interfaces/user.interface';
import { LoginDto } from './shared/dto/login.dto';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('USER_SERVICE') private readonly _userService: ClientProxy,
    @Inject('PRODUCT_SERVICE') private readonly _productService: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this._userService.connect();
  }

  @MessagePattern({ cmd: 'register' })
  async register(registerDto: RegisterDto): Promise<{
    success: boolean;
    data: IUser;
  }> {
    const user = await this.appService.register(registerDto);

    // create user profile
    const result = this._userService.send(
      { cmd: 'create_user_profile' },
      { userId: user.id, phoneNumber: null },
    );
    await lastValueFrom(result);

    // create user cart
    const cart = this._productService.send({ cmd: 'create_cart' }, +user.id);
    await lastValueFrom(cart);

    return {
      success: true,
      data: user,
    };
  }

  @MessagePattern({ cmd: 'login' })
  async login(loginDto: LoginDto): Promise<{
    success: boolean;
    data: any;
  }> {
    const user = await this.appService.login(loginDto);

    return {
      success: true,
      data: user,
    };
  }

  @MessagePattern({ cmd: 'get_auth_detail' })
  async find(userId: number): Promise<IUser> {
    return this.appService.findById(userId);
  }
}
