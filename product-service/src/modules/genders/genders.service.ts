import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { IGender } from 'src/shared/interfaces/gender.interface';

@Injectable()
export class GendersService {
  constructor(private readonly _prisma: PrismaService) {}

  getSelectedProperties() {
    return {
      id: true,
      name: true,
    };
  }

  async create(createGenderDto: CreateGenderDto): Promise<IGender> {
    return this._prisma.gender.create({
      data: createGenderDto,
      select: this.getSelectedProperties(),
    });
  }
}
