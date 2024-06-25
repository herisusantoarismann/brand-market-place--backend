import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { IProduct } from 'src/shared/interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly _productService: ProductsService) {}

  @MessagePattern({ cmd: 'find_all_products' })
  async findAll(): Promise<{
    success: boolean;
    data: IProduct[];
  }> {
    const products = await this._productService.findAll();

    return {
      success: true,
      data: products,
    };
  }

  @MessagePattern({ cmd: 'find_product' })
  async find(id: number): Promise<{
    success: boolean;
    data: IProduct;
  }> {
    const product = await this._productService.findById(id);

    return {
      success: true,
      data: product,
    };
  }

  @MessagePattern({ cmd: 'find_product_image_by_name' })
  async findByName(@Payload() name: string): Promise<string> {
    const imagePath = await this._productService.findByName(name);
    return imagePath;
  }

  @MessagePattern({ cmd: 'create_product' })
  async createUserProfile(createProductDto: CreateProductDto): Promise<{
    success: boolean;
    data: IProduct;
  }> {
    const product = await this._productService.create(createProductDto);

    return {
      success: true,
      data: product,
    };
  }

  @MessagePattern({ cmd: 'update_product' })
  async updateUserProfile(data: {
    id: number;
    data: UpdateProductDto;
  }): Promise<{
    success: boolean;
    data: any;
  }> {
    const product = await this._productService.update(data.id, data.data);

    return {
      success: true,
      data: product,
    };
  }

  @MessagePattern({
    cmd: 'delete_product',
  })
  async deleteUserProfile(id: number): Promise<{
    success: boolean;
    data: IProduct;
  }> {
    const product = await this._productService.delete(id);

    return {
      success: true,
      data: product,
    };
  }

  @MessagePattern({
    cmd: 'upload_product_image',
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
    const file = await this._productService.uploadFile(metadata, fileBuffer);

    return {
      success: true,
      data: file,
    };
  }
}
