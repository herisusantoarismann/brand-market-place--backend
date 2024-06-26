import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ICart } from 'src/shared/interfaces/cart.interface';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { ICartItem } from 'src/shared/interfaces/cart-item.interface';

@Injectable()
export class CartsService {
  constructor(private readonly _prisma: PrismaService) {}

  getSelectedCartProperties() {
    return {
      id: true,
      items: {
        select: this.getSelectedCartItemProperties(),
      },
    };
  }

  getSelectedCartItemProperties() {
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
      quantity: true,
    };
  }

  async findCartById(userId: number): Promise<ICart> {
    return this._prisma.cart.findFirst({
      where: {
        userId,
      },
      select: this.getSelectedCartProperties(),
    });
  }

  async create(userId: number): Promise<ICart> {
    return this._prisma.cart.create({
      data: {
        userId,
      },
      select: this.getSelectedCartProperties(),
    });
  }

  async createCartItem(
    userId: number,
    createCartItemDto: CreateCartItemDto,
  ): Promise<ICartItem> {
    const cart = await this.findCartById(userId);

    return this._prisma.cartItem.create({
      data: {
        ...createCartItemDto,
        cartId: cart.id,
      },
      select: this.getSelectedCartItemProperties(),
    });
  }
}
