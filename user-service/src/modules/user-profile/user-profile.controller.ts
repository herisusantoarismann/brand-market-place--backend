import { Controller } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { IUserProfile } from 'src/shared/interfaces/user-profile.interface';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly _userProfileService: UserProfileService) {}

  @MessagePattern({ cmd: 'find_all_user_profile' })
  async findAll(): Promise<{
    success: boolean;
    data: IUserProfile[];
  }> {
    const users = await this._userProfileService.findAll();

    return {
      success: true,
      data: users,
    };
  }

  @MessagePattern({ cmd: 'create_user_profile' })
  async createUserProfile(createUserProfileDto: CreateUserProfileDto): Promise<{
    success: boolean;
    data: IUserProfile;
  }> {
    const user = await this._userProfileService.create(createUserProfileDto);

    return {
      success: true,
      data: user,
    };
  }

  @MessagePattern({ cmd: 'update_user_profile' })
  async updateUserProfile(data: {
    id: number;
    data: UpdateUserProfileDto;
  }): Promise<{
    success: boolean;
    data: any;
  }> {
    const user = await this._userProfileService.update(
      Number(data.id),
      data.data,
    );

    return {
      success: true,
      data: user,
    };
  }
}
