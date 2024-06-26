import { Controller } from '@nestjs/common';
import { CartsService } from './carts.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ICart } from 'src/shared/interfaces/cart.interface';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { ICartItem } from 'src/shared/interfaces/cart-item.interface';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly _cartService: CartsService) {}

  @MessagePattern({ cmd: 'find_cart' })
  async findCart(userId: number): Promise<{
    success: boolean;
    data: ICart;
  }> {
    const cart = await this._cartService.findCartById(+userId);

    return {
      success: true,
      data: cart,
    };
  }

  @MessagePattern({ cmd: 'create_cart' })
  async createCart(userId: number): Promise<{
    success: boolean;
    data: ICart;
  }> {
    const review = await this._cartService.create(+userId);

    return {
      success: true,
      data: review,
    };
  }

  @MessagePattern({ cmd: 'create_cart_item' })
  async createCartItem(
    @Payload()
    payload: {
      userId: number;
      createCartItemDto: CreateCartItemDto;
    },
  ): Promise<{
    success: boolean;
    data: ICartItem;
  }> {
    const { userId, createCartItemDto } = payload;

    const cartItem = await this._cartService.createCartItem(
      +userId,
      createCartItemDto,
    );

    return {
      success: true,
      data: cartItem,
    };
  }

  @MessagePattern({ cmd: 'update_cart_item' })
  async updateCartItem(
    @Payload()
    payload: {
      id: number;
      updateCartItemDto: UpdateCartItemDto;
    },
  ): Promise<{
    success: boolean;
    data: ICartItem;
  }> {
    const { id, updateCartItemDto } = payload;

    const cartItem = await this._cartService.updateCartItem(
      +id,
      updateCartItemDto,
    );

    return {
      success: true,
      data: cartItem,
    };
  }

  @MessagePattern({
    cmd: 'delete_cart_item',
  })
  async deleteCartItem(id: number): Promise<{
    success: boolean;
    data: ICartItem;
  }> {
    const cartItem = await this._cartService.delete(+id);

    return {
      success: true,
      data: cartItem,
    };
  }
}
