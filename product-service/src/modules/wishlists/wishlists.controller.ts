import { Controller } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { IWishlist } from 'src/shared/interfaces/wishlist.interface';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly _wishlistService: WishlistsService) {}

  @MessagePattern({ cmd: 'create_wishlist' })
  async createUserProfile(createWishlistDto: CreateWishlistDto): Promise<{
    success: boolean;
    data: IWishlist;
  }> {
    const wishlist = await this._wishlistService.create(createWishlistDto);

    return {
      success: true,
      data: wishlist,
    };
  }
}
