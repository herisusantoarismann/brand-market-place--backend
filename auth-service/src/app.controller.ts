import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterDto } from './shared/dto/register.dto';
import { IUser } from './shared/interfaces/user.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'register' })
  async register(registerDto: RegisterDto): Promise<{
    success: boolean;
    data: any;
  }> {
    const user = await this.appService.register(registerDto);

    return {
      success: true,
      data: user,
    };
  }
}
