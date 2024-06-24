import { Inject, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { IWishlist } from 'src/shared/interfaces/wishlist.interface';
import { PrismaService } from 'src/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WishlistsService {
  constructor(
    private readonly _prisma: PrismaService,
    @Inject('AUTH_SERVICE') private readonly _authService: ClientProxy,
  ) {}

  getSelectedProperties() {
    return {
      id: true,
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          images: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
    };
  }

  async findAll(userId: number): Promise<IWishlist[]> {
    return this._prisma.wishlist.findMany({
      where: {
        userId,
      },
      select: this.getSelectedProperties(),
    });
  }

  async create(
    userId: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<IWishlist> {
    return this._prisma.wishlist.create({
      data: {
        userId,
        product: {
          connect: {
            id: createWishlistDto.productId,
          },
        },
      },
      select: this.getSelectedProperties(),
    });
  }
}
