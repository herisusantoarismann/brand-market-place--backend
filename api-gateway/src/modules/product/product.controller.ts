import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipeBuilder,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Observable, catchError, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Controller('/')
export class ProductController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly _productService: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this._productService.connect();
  }

  @Get('/products')
  findAll(): Observable<any> {
    return this._productService
      .send({ cmd: 'find_all_product_service' }, '')
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  // @Get('/product/:id')
  // find(@Param('id') userId: string): Observable<any> {
  //   return this._productService
  //     .send({ cmd: 'find_product' }, +userId)
  //     .pipe(
  //       catchError((error) =>
  //         throwError(() => new RpcException(error.response)),
  //       ),
  //     );
  // }

  // @Post('/')
  // create(@Body() createUserProfileDto: Create): Observable<any> {
  //   return this._userService
  //     .send({ cmd: 'create_user_profile' }, createUserProfileDto)
  //     .pipe(
  //       catchError((error) =>
  //         throwError(() => new RpcException(error.response)),
  //       ),
  //     );
  // }

  // @Put('/:id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserProfileDto: UpdateUserProfileDto,
  // ): Observable<any> {
  //   return this._userService
  //     .send(
  //       {
  //         cmd: 'update_user_profile',
  //       },
  //       { id: Number(id), data: updateUserProfileDto },
  //     )
  //     .pipe(
  //       catchError((error) =>
  //         throwError(() => new RpcException(error.response)),
  //       ),
  //     );
  // }

  // @Delete('/:id')
  // delete(@Param('id') id: string): Observable<any> {
  //   return this._userService
  //     .send(
  //       {
  //         cmd: 'delete_user_profile',
  //       },
  //       Number(id),
  //     )
  //     .pipe(
  //       catchError((error) =>
  //         throwError(() => new RpcException(error.response)),
  //       ),
  //     );
  // }

  @Post('/product/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const ext = file.originalname.split('.').pop();
          const fileName = `${uuidv4()}.${ext}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new Error('Only JPG, JPEG, and PNG files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<any> {
    const metadata = {
      filename: file.filename,
      originalname: file.originalname,
      destination: './uploads/products',
      mimetype: file.mimetype,
    };

    // Baca file sebagai buffer
    const filePath = path.join(metadata.destination, file.filename);
    const fileBuffer = await fs.promises.readFile(filePath);

    // Encode buffer ke base64
    const fileBase64 = fileBuffer.toString('base64');

    const result = this._productService
      .send({ cmd: 'upload_product_image' }, { metadata, fileBase64 })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );

    await fs.promises.unlink(filePath);

    return result;
  }
}
