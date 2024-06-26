import { Controller } from '@nestjs/common';
import { CartsService } from './carts.service';
import { MessagePattern } from '@nestjs/microservices';
import { ICart } from 'src/shared/interfaces/cart.interface';

@Controller('carts')
export class CartsController {
  constructor(private readonly _cartService: CartsService) {}

  @MessagePattern({ cmd: 'find_cart' })
  async find(userId: number): Promise<{
    success: boolean;
    data: ICart;
  }> {
    const cart = await this._cartService.findById(+userId);

    return {
      success: true,
      data: cart,
    };
  }

  @MessagePattern({ cmd: 'create_cart' })
  async createBrand(userId: number): Promise<{
    success: boolean;
    data: ICart;
  }> {
    const review = await this._cartService.create(+userId);

    return {
      success: true,
      data: review,
    };
  }
}
