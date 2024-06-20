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
    const result = this._userService.send(
      { cmd: 'create_user_profile' },
      { userId: user.id, phoneNumber: null },
    );
    await lastValueFrom(result);

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
}
