import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { IBrand } from 'src/shared/interfaces/brand.interface';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly _brandsService: BrandsService) {}

  @MessagePattern({ cmd: 'find_all_brands' })
  async findAll(): Promise<{
    success: boolean;
    data: IBrand[];
  }> {
    const products = await this._brandsService.findAll();

    return {
      success: true,
      data: products,
    };
  }

  @MessagePattern({ cmd: 'find_brand' })
  async find(id: number): Promise<{
    success: boolean;
    data: IBrand;
  }> {
    const product = await this._brandsService.findById(id);

    return {
      success: true,
      data: product,
    };
  }

  @MessagePattern({ cmd: 'create_brand' })
  async createBrand(createBrandDto: CreateBrandDto): Promise<{
    success: boolean;
    data: IBrand;
  }> {
    const brand = await this._brandsService.create(createBrandDto);

    return {
      success: true,
      data: brand,
    };
  }

  @MessagePattern({ cmd: 'update_brand' })
  async updateBrand(data: { id: number; data: UpdateBrandDto }): Promise<{
    success: boolean;
    data: IBrand;
  }> {
    const brand = await this._brandsService.update(data.id, data.data);

    return {
      success: true,
      data: brand,
    };
  }

  @MessagePattern({
    cmd: 'upload_brand_image',
  })
  async uploadFile(
    @Payload()
    payload: {
      metadata: {
        filename: string;
        mimetype: string;
      };
      fileBase64: string;
    },
  ): Promise<{ success: Boolean; data: any }> {
    const { metadata, fileBase64 } = payload;
    const fileBuffer = Buffer.from(fileBase64, 'base64');
    const file = await this._brandsService.uploadFile(metadata, fileBuffer);

    return {
      success: true,
      data: file,
    };
  }
}
