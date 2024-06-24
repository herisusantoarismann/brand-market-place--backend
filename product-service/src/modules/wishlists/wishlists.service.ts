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
      userId: true,
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

  async getUser(
    userId: number,
  ): Promise<{ id: number; name: string; email: string }> {
    const result = this._authService.send({ cmd: 'get_auth_detail' }, +userId);
    return lastValueFrom(result);
  }

  async create(createWishlistDto: CreateWishlistDto): Promise<IWishlist> {
    const user = await this.getUser(+createWishlistDto.userId);

    const wishlist = await this._prisma.wishlist.create({
      data: {
        userId: createWishlistDto.userId,
        product: {
          connect: {
            id: createWishlistDto.productId,
          },
        },
      },
      select: this.getSelectedProperties(),
    });

    return {
      id: wishlist.id,
      user: user,
      product: wishlist.product,
    };
  }
}
