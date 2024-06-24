import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma.service';
import { ICategoryImage } from 'src/shared/interfaces/category-image.interface';

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

      const savedFile = await this._prisma.brandImage.create({
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
