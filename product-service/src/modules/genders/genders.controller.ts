import { Controller } from '@nestjs/common';
import { GendersService } from './genders.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IGender } from 'src/shared/interfaces/gender.interface';

@Controller('genders')
export class GendersController {
  constructor(private readonly _genderService: GendersService) {}

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
}
