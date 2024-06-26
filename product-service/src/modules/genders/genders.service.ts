import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { IGender } from 'src/shared/interfaces/gender.interface';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GendersService {
  constructor(private readonly _prisma: PrismaService) {}

  getSelectedProperties() {
    return {
      id: true,
      name: true,
    };
  }

  async findAll(): Promise<IGender[]> {
    return this._prisma.gender.findMany({
      select: this.getSelectedProperties(),
    });
  }

  async findById(id: number): Promise<IGender> {
    return this._prisma.gender.findUnique({
      where: {
        id,
      },
      select: this.getSelectedProperties(),
    });
  }

  async create(createGenderDto: CreateGenderDto): Promise<IGender> {
    return this._prisma.gender.create({
      data: createGenderDto,
      select: this.getSelectedProperties(),
    });
  }

  async update(id: number, data: UpdateGenderDto): Promise<IGender> {
    const gender = await this.findById(id);

    if (!gender) {
      throw new RpcException(new BadRequestException('Gender Not Found'));
    }

    return this._prisma.gender.update({
      where: {
        id,
      },
      data: data,
      select: this.getSelectedProperties(),
    });
  }

  async delete(id: number): Promise<IGender> {
    const gender = await this.findById(id);

    if (!gender) {
      throw new RpcException(new BadRequestException('Gender Not Found'));
    }

    return this._prisma.gender.delete({
      where: {
        id,
      },
      select: this.getSelectedProperties(),
    });
  }
}
