import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ICart } from 'src/shared/interfaces/cart.interface';

@Injectable()
export class CartsService {
  constructor(private readonly _prisma: PrismaService) {}

  getSelectedProperties() {
    return {
      id: true,
      items: {
        select: {
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
        },
      },
    };
  }

  async findById(userId: number): Promise<ICart> {
    return this._prisma.cart.findFirst({
      where: {
        userId,
      },
      select: this.getSelectedProperties(),
    });
  }

  async create(userId: number): Promise<ICart> {
    return this._prisma.cart.create({
      data: {
        userId,
      },
      select: this.getSelectedProperties(),
    });
  }
}
