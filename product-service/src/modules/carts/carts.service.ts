import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ICart } from 'src/shared/interfaces/cart.interface';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { ICartItem } from 'src/shared/interfaces/cart-item.interface';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RpcException } from '@nestjs/microservices';

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

  async findCartItemById(id: number): Promise<ICartItem> {
    return this._prisma.cartItem.findUnique({
      where: {
        id,
      },
      select: this.getSelectedCartItemProperties(),
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

  async updateCartItem(
    id: number,
    data: UpdateCartItemDto,
  ): Promise<ICartItem> {
    const cartItem = await this.findCartItemById(id);

    if (!cartItem) {
      throw new RpcException(new BadRequestException('Cart Item Not Found'));
    }

    return this._prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        quantity: data.quantity,
      },
      select: this.getSelectedCartItemProperties(),
    });
  }

  async delete(id: number): Promise<ICartItem> {
    const cartItem = await this.findCartItemById(id);

    if (!cartItem) {
      throw new RpcException(new BadRequestException('Cart Item Not Found'));
    }

    return this._prisma.cartItem.delete({
      where: {
        id,
      },
      select: this.getSelectedCartItemProperties(),
    });
  }
}
