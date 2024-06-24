import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma.service';
import { ICategoryImage } from 'src/shared/interfaces/category-image.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ICategory } from 'src/shared/interfaces/category.interface';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
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

    this.cloudFrontUrl = this.configService.get<string>('CLOUDFRONT_URL');
  }

  getSelectedProperties() {
    return {
      id: true,
      name: true,
      description: true,
      image: {
        select: {
          id: true,
          url: true,
        },
      },
    };
  }

  async findAll(): Promise<ICategory[]> {
    const categories = await this._prisma.category.findMany({
      select: this.getSelectedProperties(),
    });

    return categories.map((item) => {
      return {
        ...item,
        image: item.image[0] ?? null,
      };
    });
  }

  async findById(id: number): Promise<ICategory> {
    const category = await this._prisma.category.findUnique({
      where: {
        id,
      },
      select: this.getSelectedProperties(),
    });

    return {
      ...category,
      image: category.image[0] ?? null,
    };
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<ICategory> {
    const category = await this._prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description,
        image: {
          connect: {
            id: createCategoryDto.imageId,
          },
        },
      },
      select: this.getSelectedProperties(),
    });

    return {
      ...category,
      image: category.image[0] ?? null,
    };
  }

  async update(id: number, data: UpdateCategoryDto): Promise<ICategory> {
    const category = await this.findById(id);

    if (!category) {
      throw new RpcException(new BadRequestException('Category Not Found'));
    }

    const newCategory = await this._prisma.category.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        image: {
          connect: {
            id: data.imageId,
          },
        },
      },
      select: this.getSelectedProperties(),
    });

    return {
      ...newCategory,
      image: newCategory.image[0] ?? null,
    };
  }

  async delete(id: number): Promise<ICategory> {
    const category = await this.findById(id);

    if (!category) {
      throw new RpcException(new BadRequestException('Category Not Found'));
    }

    const deletedCategory = await this._prisma.category.delete({
      where: {
        id,
      },
      select: this.getSelectedProperties(),
    });

    return {
      ...deletedCategory,
      image: deletedCategory.image[0] ?? null,
    };
  }

  async uploadFile(
    metadata: {
      filename: string;
      mimetype: string;
    },
    fileBuffer: Buffer,
  ): Promise<ICategoryImage> {
    if (!fileBuffer) {
      throw new RpcException(new NotFoundException('No file uploaded'));
    }

    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const uploadParams = {
      Bucket: bucketName,
      Key: `category/${metadata.filename}`,
      Body: fileBuffer,
      ContentType: metadata.mimetype,
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);

      const savedFile = await this._prisma.categoryImage.create({
        data: {
          name: metadata.filename,
          url: `${this.cloudFrontUrl}/category/${metadata.filename}`,
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
        new InternalServerErrorException('Opps, there is an error.'),
      );
    }
  }
}
