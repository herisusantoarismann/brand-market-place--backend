import { Controller } from '@nestjs/common';
import { GendersService } from './genders.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IGender } from 'src/shared/interfaces/gender.interface';
import { UpdateGenderDto } from './dto/update-gender.dto';

@Controller('genders')
export class GendersController {
  constructor(private readonly _genderService: GendersService) {}

  @MessagePattern({ cmd: 'find_all_genders' })
  async findAll(): Promise<{
    success: boolean;
    data: IGender[];
  }> {
    const reviews = await this._genderService.findAll();

    return {
      success: true,
      data: reviews,
    };
  }

  @MessagePattern({ cmd: 'find_gender' })
  async find(id: number): Promise<{
    success: boolean;
    data: IGender;
  }> {
    const gender = await this._genderService.findById(+id);

    return {
      success: true,
      data: gender,
    };
  }

  @MessagePattern({ cmd: 'create_gender' })
  async createBrand(createGenderDto: CreateGenderDto): Promise<{
    success: boolean;
    data: IGender;
  }> {
    const gender = await this._genderService.create(createGenderDto);

    return {
      success: true,
      data: gender,
    };
  }

  @MessagePattern({ cmd: 'update_gender' })
  async updateBrand(
    @Payload()
    payload: {
      id: number;
      data: UpdateGenderDto;
    },
  ): Promise<{
    success: boolean;
    data: IGender;
  }> {
    const { id, data } = payload;

    const gender = await this._genderService.update(id, data);

    return {
      success: true,
      data: gender,
    };
  }

  @MessagePattern({
    cmd: 'delete_gender',
  })
  async delete(id: number): Promise<{
    success: boolean;
    data: IGender;
  }> {
    const gender = await this._genderService.delete(+id);

    return {
      success: true,
      data: gender,
    };
  }
}
