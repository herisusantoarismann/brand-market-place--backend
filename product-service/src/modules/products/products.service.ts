import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IProduct } from 'src/shared/interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as path from 'path';
import { IProductImage } from 'src/shared/interfaces/product-image.interface';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { lastValueFrom } from 'rxjs';
import { IReview } from 'src/shared/interfaces/review.interface';

@Injectable()
export class ProductsService {
  private s3Client: S3Client;
  private cloudFrontUrl: string;

  constructor(
    @Inject('AUTH_SERVICE') private readonly _authService: ClientProxy,
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

    this.cloudFrontUrl = this.configService.get<string>('CLOUDFRONT_URL');
  }

  getSelectedProperties() {
    return {
      id: true,
      name: true,
      description: true,
      price: true,
      sizes: true,
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
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

  async getUser(
    userId: number,
  ): Promise<{ id: number; name: string; email: string }> {
    const result = this._authService.send({ cmd: 'get_auth_detail' }, +userId);
    return lastValueFrom(result);
  }

  async findAll(): Promise<IProduct[]> {
    const products = await this._prisma.product.findMany({
      select: this.getSelectedProperties(),
    });

    const newProducts = await Promise.all(
      products.map(async (product: IProduct) => {
        const reviews = await Promise.all(
          product.reviews.map(async (review: IReview) => {
            const user = await this.getUser(review.userId);

            return {
              id: review.id,
              user,
              content: review.content,
              rating: review.rating,
            };
          }),
        );

        return {
          ...product,
          reviews,
        };
      }),
    );

    return newProducts;
  }

  async create(createProductDto: CreateProductDto): Promise<IProduct> {
    return this._prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        sizes: createProductDto.sizes,
        categories: {
          connect: createProductDto.categoryIds.map((id) => ({ id })),
        },
        images: {
          connect: createProductDto.imageIds.map((id) => ({ id })),
        },
      },
      select: this.getSelectedProperties(),
    });
  }

  async findById(id: number): Promise<IProduct> {
    const product = await this._prisma.product.findUnique({
      where: {
        id,
      },
      select: this.getSelectedProperties(),
    });

    const reviews = await Promise.all(
      product.reviews.map(async (review: IReview) => {
        const user = await this.getUser(review.userId);

        return {
          id: review.id,
          user,
          content: review.content,
          rating: review.rating,
        };
      }),
    );

    return {
      ...product,
      reviews,
    };
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

    const updatedProduct = await this._prisma.product.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        sizes: data.sizes,
        categories: {
          connect: data.categoryIds.map((id) => ({ id })),
        },
        images: {
          connect: data.imageIds.map((id) => ({ id })),
        },
      },
      select: this.getSelectedProperties(),
    });

    const reviews = await Promise.all(
      updatedProduct.reviews.map(async (review: IReview) => {
        const user = await this.getUser(review.userId);

        return {
          id: review.id,
          user,
          content: review.content,
          rating: review.rating,
        };
      }),
    );

    return {
      ...updatedProduct,
      reviews,
    };
  }

  async delete(id: number): Promise<IProduct> {
    const product = await this.findById(id);

    if (!product) {
      throw new RpcException(new BadRequestException('Product Not Found'));
    }

    const deletedProduct = await this._prisma.product.delete({
      where: {
        id,
      },
      select: this.getSelectedProperties(),
    });

    const reviews = await Promise.all(
      deletedProduct.reviews.map(async (review: IReview) => {
        const user = await this.getUser(review.userId);

        return {
          id: review.id,
          user,
          content: review.content,
          rating: review.rating,
        };
      }),
    );

    return {
      ...deletedProduct,
      reviews,
    };
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

    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const uploadParams = {
      Bucket: bucketName,
      Key: `products/${metadata.filename}`,
      Body: fileBuffer,
      ContentType: metadata.mimetype,
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);

      const savedFile = await this._prisma.productImage.create({
        data: {
          name: metadata.filename,
          url: `${this.cloudFrontUrl}/products/${metadata.filename}`,
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
    } catch (err) {
      throw new RpcException(
        new InternalServerErrorException('Oops, there is an error.'),
      );
    }
  }
}
