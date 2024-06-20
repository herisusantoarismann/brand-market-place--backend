import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';
import { PrismaService } from 'src/prisma.service';
import { UserProfileService } from './user-profile.service';

@Module({
  controllers: [UserProfileController],
  providers: [UserProfileService, PrismaService],
})
export class UserProfileModule {}
