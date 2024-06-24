import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { IWishlist } from 'src/shared/interfaces/wishlist.interface';
import { PrismaService } from 'src/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
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

  getUser(userId: number): Promise<{
    id: number;
    name: string;
    email: string;
  }> {
    const result = this._authService.send({ cmd: 'get_auth_detail' }, +userId);
    return lastValueFrom(result);
  }

  async findAll(userId: number): Promise<IWishlist[]> {
    const user = await this.getUser(userId);

    if (!user) {
      throw new RpcException(new NotFoundException('User Not Found'));
    }

    return this._prisma.wishlist.findMany({
      where: {
        userId,
      },
      select: this.getSelectedProperties(),
    });
  }

  async findById(userId: number, id: number): Promise<IWishlist> {
    const user = await this.getUser(userId);

    if (!user) {
      throw new RpcException(new NotFoundException('User Not Found'));
    }

    return this._prisma.wishlist.findFirst({
      where: {
        userId,
        id,
      },
      select: this.getSelectedProperties(),
    });
  }

  async create(
    userId: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<IWishlist> {
    const user = await this.getUser(userId);

    if (!user) {
      throw new RpcException(new NotFoundException('User Not Found'));
    }

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
