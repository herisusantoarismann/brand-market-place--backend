import { Module } from '@nestjs/common';
import { WhislistsService } from './whislists.service';
import { WhislistsController } from './whislists.controller';

@Module({
  providers: [WhislistsService],
  controllers: [WhislistsController]
})
export class WhislistsModule {}
