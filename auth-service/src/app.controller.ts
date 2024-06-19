import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterDto } from './shared/dto/register.dto';
import { IUser } from './shared/interfaces/user.interface';
import { LoginDto } from './shared/dto/login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'register' })
  async register(registerDto: RegisterDto): Promise<{
    success: boolean;
    data: IUser;
  }> {
    const user = await this.appService.register(registerDto);

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
