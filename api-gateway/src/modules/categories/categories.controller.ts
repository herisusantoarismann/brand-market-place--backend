import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('/')
export class CategoriesController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly _productService: ClientProxy,
  ) {}

  @Get('/categories')
  findAll(): Observable<any> {
    return this._productService
      .send({ cmd: 'find_all_categories' }, '')
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Get('/category/:id')
  find(@Param('id') categoryId: string): Observable<any> {
    return this._productService
      .send({ cmd: 'find_category' }, +categoryId)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Post('/category')
  create(@Body() createCategoryDto: CreateCategoryDto): Observable<any> {
    return this._productService
      .send({ cmd: 'create_category' }, createCategoryDto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Put('/category/:id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Observable<any> {
    return this._productService
      .send(
        {
          cmd: 'update_category',
        },
        { id: Number(id), data: updateCategoryDto },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Post('/category/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/categories',
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
      destination: './uploads/categories',
      mimetype: file.mimetype,
    };

    const filePath = path.join(metadata.destination, file.filename);
    const fileBuffer = await fs.promises.readFile(filePath);

    const fileBase64 = fileBuffer.toString('base64');

    const result = this._productService
      .send({ cmd: 'upload_category_image' }, { metadata, fileBase64 })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );

    await fs.promises.unlink(filePath);

    return result;
  }
}
