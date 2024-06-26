import { Module } from '@nestjs/common';
import { GendersController } from './genders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        options: {
          host: 'localhost',
          port: 3003,
        },
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [GendersController],
})
export class GendersModule {}
