import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IProduct } from 'src/shared/interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';
import * as path from 'path';
import { IProductImage } from 'src/shared/interfaces/product-image.interface';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class ProductsService {
  private s3Client: S3Client;
  private cloudFrontUrl: string;

  constructor(
    private readonly _prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.cloudFrontUrl = this.configService.get<string>(
      'CLOUDFRONT_PRODUCT_URL',
    );
  }

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
          name: true,
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
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        sizes: createProductDto.sizes,
        images: {
          connect: createProductDto.imageIds.map((id) => ({ id })),
        },
      },
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

  async findByName(name: string): Promise<string> {
    const product = await this._prisma.productImage.findFirst({
      where: {
        name,
      },
      select: {
        id: true,
        name: true,
        url: true,
      },
    });

    if (!product) {
      throw new RpcException(new NotFoundException('Image Not Found'));
    }

    return product.url;
  }

  async update(id: number, data: UpdateProductDto): Promise<IProduct> {
    const product = await this.findById(id);

    if (!product) {
      throw new RpcException(new BadRequestException('Product Not Found'));
    }

    return this._prisma.product.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        sizes: data.sizes,
        images: {
          connect: data.imageIds.map((id) => ({ id })),
        },
      },
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

  async uploadFile(
    metadata: {
      filename: string;
      mimetype: string;
    },
    fileBuffer: Buffer,
  ): Promise<IProductImage> {
    if (!fileBuffer) {
      throw new RpcException(new NotFoundException('No file uploaded'));
    }

    const bucketName = this.configService.get<string>(
      'AWS_S3_PRODUCT_BUCKET_NAME',
    );
    const uploadParams = {
      Bucket: bucketName,
      Key: metadata.filename,
      Body: fileBuffer,
      ContentType: metadata.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command);

    const savedFile = await this._prisma.productImage.create({
      data: {
        name: metadata.filename,
        url: `${this.cloudFrontUrl}/${metadata.filename}`,
      },
      select: {
        id: true,
        name: true,
        url: true,
      },
    });

    if (!savedFile) {
      throw new RpcException(new NotFoundException('File failed to upload'));
    }

    return savedFile;
  }
}
