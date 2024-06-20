import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        options: {
          host: 'localhost',
          port: 3002,
        },
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [UserController],
})
export class UserModule {}
