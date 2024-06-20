import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly _productService: ProductsService) {}

  @MessagePattern({ cmd: 'find_all_product_service' })
  async findAll(): Promise<{
    success: boolean;
    data: any;
  }> {
    // const users = await this._productService.findAll();

    return {
      success: true,
      data: 'Called',
    };
  }
}
