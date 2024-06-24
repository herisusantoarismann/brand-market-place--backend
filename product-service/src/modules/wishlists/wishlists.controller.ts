import { Controller } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { IWishlist } from 'src/shared/interfaces/wishlist.interface';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly _wishlistService: WishlistsService) {}

  @MessagePattern({ cmd: 'find_all_wishlists' })
  async findAll(userId: number): Promise<{
    success: boolean;
    data: IWishlist[];
  }> {
    const products = await this._wishlistService.findAll(+userId);

    return {
      success: true,
      data: products,
    };
  }

  @MessagePattern({ cmd: 'find_wishlist' })
  async find(@Payload() payload: { userId: number; id: number }): Promise<{
    success: boolean;
    data: IWishlist;
  }> {
    const { userId, id } = payload;

    const product = await this._wishlistService.findById(userId, id);

    return {
      success: true,
      data: product,
    };
  }

  @MessagePattern({ cmd: 'create_wishlist' })
  async createUserProfile(
    @Payload()
    payload: {
      userId: number;
      createWishlistDto: CreateWishlistDto;
    },
  ): Promise<{
    success: boolean;
    data: IWishlist;
  }> {
    const { userId, createWishlistDto } = payload;

    const wishlist = await this._wishlistService.create(
      userId,
      createWishlistDto,
    );

    return {
      success: true,
      data: wishlist,
    };
  }
}
