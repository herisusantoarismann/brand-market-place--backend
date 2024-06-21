import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { IProduct } from 'src/shared/interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { IProductImage } from 'src/shared/interfaces/product-image.interface';
import * as path from 'path';
import { writeFile } from 'fs';

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
    @Payload() payload: any,
  ): Promise<{ success: Boolean; data: any }> {
    const { metadata, fileBase64 } = payload;
    const { filename, originalname, mimetype } = metadata;
    const fileBuffer = Buffer.from(fileBase64, 'base64');

    const savePath = path.join('./uploads/products', filename);
    const file = await this._productService.uploadFile(metadata);

    writeFile(savePath, fileBuffer, () => {});

    return {
      success: true,
      data: file,
    };
  }
}
