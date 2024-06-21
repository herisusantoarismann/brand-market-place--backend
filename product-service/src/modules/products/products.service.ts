import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IProduct } from 'src/shared/interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(private readonly _prisma: PrismaService) {}

  getSelectedProperties() {
    return {
      id: true,
      name: true,
      description: true,
      price: true,
      sizes: true,
      images: {
        select: {
          id: true,
          url: true,
        },
      },
      reviews: {
        select: {
          id: true,
          content: true,
          userId: true,
          rating: true,
        },
      },
    };
  }

  async findAll(): Promise<IProduct[]> {
    return this._prisma.product.findMany({
      select: this.getSelectedProperties(),
    });
  }

  async create(createProductDto: CreateProductDto): Promise<IProduct> {
    return this._prisma.product.create({
      data: createProductDto,
      select: this.getSelectedProperties(),
    });
  }

  async findById(id: number): Promise<IProduct> {
    return this._prisma.product.findUnique({
      where: {
        id,
      },
      select: this.getSelectedProperties(),
    });
  }

  async update(id: number, data: UpdateProductDto): Promise<IProduct> {
    const userProfile = await this.findById(id);

    if (!userProfile) {
      throw new RpcException(new BadRequestException('Product Not Found'));
    }

    return this._prisma.product.update({
      where: {
        id,
      },
      data,
      select: this.getSelectedProperties(),
    });
  }

  async delete(id: number): Promise<IProduct> {
    const product = await this.findById(id);

    if (!product) {
      throw new RpcException(new BadRequestException('Product Not Found'));
    }

    return this._prisma.product.delete({
      where: {
        id,
      },
      select: this.getSelectedProperties(),
    });
  }
}
