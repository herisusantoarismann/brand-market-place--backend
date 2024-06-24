import { IProduct } from './product.interface';

export interface IWishlist {
  id: number;
  userId: number;
  productId?: number;
  product?: IProduct;
}
