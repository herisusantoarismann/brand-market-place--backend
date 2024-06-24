import { Controller } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ICategory } from 'src/shared/interfaces/category.interface';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly _categoryService: CategoriesService) {}

  @MessagePattern({ cmd: 'find_all_categories' })
  async findAll(): Promise<{
    success: boolean;
    data: ICategory[];
  }> {
    const categories = await this._categoryService.findAll();

    return {
      success: true,
      data: categories,
    };
  }

  @MessagePattern({ cmd: 'find_category' })
  async find(id: number): Promise<{
    success: boolean;
    data: ICategory;
  }> {
    const category = await this._categoryService.findById(id);

    return {
      success: true,
      data: category,
    };
  }

  @MessagePattern({ cmd: 'create_category' })
  async createBrand(createCategoryDto: CreateCategoryDto): Promise<{
    success: boolean;
    data: ICategory;
  }> {
    const category = await this._categoryService.create(createCategoryDto);

    return {
      success: true,
      data: category,
    };
  }

  @MessagePattern({ cmd: 'update_category' })
  async updateBrand(data: { id: number; data: UpdateCategoryDto }): Promise<{
    success: boolean;
    data: ICategory;
  }> {
    const brand = await this._categoryService.update(data.id, data.data);

    return {
      success: true,
      data: brand,
    };
  }

  @MessagePattern({
    cmd: 'upload_category_image',
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
    const file = await this._categoryService.uploadFile(metadata, fileBuffer);

    return {
      success: true,
      data: file,
    };
  }
}
