import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma.service';
import { IBrandImage } from 'src/shared/interfaces/brand-image.interface';
import { IBrand } from 'src/shared/interfaces/brand.interface';
import { CreateBrandDto } from './dto/create-brand.dto';

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

    this.cloudFrontUrl = this.configService.get<string>('CLOUDFRONT_BRAND_URL');
  }

  getSelectedProperties() {
    return {
      id: true,
      name: true,
      image: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    };
  }

  async create(createBrandDto: CreateBrandDto): Promise<IBrand> {
    return this._prisma.brand.create({
      data: {
        name: createBrandDto.name,
        description: createBrandDto.description,
        image: {
          connect: createBrandDto.imageIds.map((id) => ({ id })),
        },
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
  ): Promise<IBrandImage> {
    if (!fileBuffer) {
      throw new RpcException(new NotFoundException('No file uploaded'));
    }

    const bucketName = this.configService.get<string>(
      'AWS_S3_BRAND_BUCKET_NAME',
    );
    const uploadParams = {
      Bucket: bucketName,
      Key: metadata.filename,
      Body: fileBuffer,
      ContentType: metadata.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command);

    const savedFile = await this._prisma.brandImage.create({
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
