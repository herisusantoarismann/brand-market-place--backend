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
import { IBrandImage } from 'src/shared/interfaces/brand-image.interface';
import { IBrand } from 'src/shared/interfaces/brand.interface';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
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
          name: true,
          url: true,
        },
      },
    };
  }

  async findAll(): Promise<IBrand[]> {
    const brands = await this._prisma.brand.findMany({
      select: this.getSelectedProperties(),
    });

    return brands.map((item) => {
      return {
        ...item,
        image: item.image[0] ?? null,
      };
    });
  }

  async findById(id: number): Promise<IBrand> {
    const brand = await this._prisma.brand.findUnique({
      where: {
        id,
      },
      select: this.getSelectedProperties(),
    });

    return {
      ...brand,
      image: brand.image[0] ?? null,
    };
  }

  async create(createBrandDto: CreateBrandDto): Promise<IBrand> {
    const brand = await this._prisma.brand.create({
      data: {
        name: createBrandDto.name,
        description: createBrandDto.description,
        image: {
          connect: {
            id: createBrandDto.imageId,
          },
        },
      },
      select: this.getSelectedProperties(),
    });

    return {
      ...brand,
      image: brand.image[0] ?? null,
    };
  }

  async update(id: number, data: UpdateBrandDto): Promise<IBrand> {
    const brand = await this.findById(id);

    if (!brand) {
      throw new RpcException(new BadRequestException('Brand Not Found'));
    }

    const newBrand = await this._prisma.brand.update({
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
      ...newBrand,
      image: newBrand.image[0] ?? null,
    };
  }

  async delete(id: number): Promise<IBrand> {
    const brand = await this.findById(id);

    if (!brand) {
      throw new RpcException(new BadRequestException('Brand Not Found'));
    }

    const deletedBrand = await this._prisma.brand.delete({
      where: {
        id,
      },
      select: this.getSelectedProperties(),
    });

    return {
      ...deletedBrand,
      image: deletedBrand.image[0] ?? null,
    };
  }

  async uploadFile(
    metadata: {
      filename: string;
      mimetype: string;
    },
    fileBuffer: Buffer,
  ): Promise<IBrandImage> {
    if (!fileBuffer) {
      throw new RpcException(new NotFoundException('No file uploaded'));
    }

    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const uploadParams = {
      Bucket: bucketName,
      Key: `brands/${metadata.filename}`,
      Body: fileBuffer,
      ContentType: metadata.mimetype,
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);

      const savedFile = await this._prisma.brandImage.create({
        data: {
          name: metadata.filename,
          url: `${this.cloudFrontUrl}/brands/${metadata.filename}`,
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
