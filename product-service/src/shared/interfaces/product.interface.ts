import { IProductImage } from './product-image.interface';
import { IReview } from './review.interface';
import { IWishlist } from './wishlist.interface';

export interface IProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  sizes?: any;
  reviews?: IReview[];
  images: IProductImage[];
  wishlists?: IWishlist;
}
