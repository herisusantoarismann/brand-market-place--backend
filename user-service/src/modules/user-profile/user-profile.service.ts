import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { IUserProfile } from 'src/shared/interfaces/user-profile.interface';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserProfileService {
  constructor(private readonly _prisma: PrismaService) {}

  getSelectedProperties() {
    return {
      id: true,
      userId: true,
      phoneNumber: true,
      addressBooks: {
        select: {
          id: true,
          type: true,
          recipientName: true,
          addressLine: true,
          city: true,
          state: true,
          postalCode: true,
          isDefault: true,
        },
      },
    };
  }

  async findAll(): Promise<IUserProfile[]> {
    return this._prisma.userProfile.findMany({
      select: this.getSelectedProperties(),
    });
  }

  async create(
    createUserProfileDto: CreateUserProfileDto,
  ): Promise<IUserProfile> {
    return this._prisma.userProfile.create({
      data: createUserProfileDto,
      select: this.getSelectedProperties(),
    });
  }

  async findById(id: number): Promise<IUserProfile> {
    return this._prisma.userProfile.findUnique({
      where: {
        userId: id,
      },
      select: this.getSelectedProperties(),
    });
  }

  async update(id: number, data: UpdateUserProfileDto): Promise<IUserProfile> {
    const userProfile = await this.findById(id);

    if (!userProfile) {
      throw new RpcException(new BadRequestException('User Not Found'));
    }

    return this._prisma.userProfile.update({
      where: {
        userId: id,
      },
      data,
      select: this.getSelectedProperties(),
    });
  }

  async delete(id: number): Promise<IUserProfile> {
    const userProfile = await this.findById(id);

    if (!userProfile) {
      throw new RpcException(new BadRequestException('User Not Found'));
    }

    return this._prisma.userProfile.delete({
      where: {
        userId: id,
      },
      select: this.getSelectedProperties(),
    });
  }
}
