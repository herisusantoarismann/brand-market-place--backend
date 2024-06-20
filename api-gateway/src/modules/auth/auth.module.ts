import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        options: {
          host: 'localhost',
          port: 3001,
        },
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
