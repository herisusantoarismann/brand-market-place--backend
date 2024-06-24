import { Controller } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly _categoryService: CategoriesService) {}

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
