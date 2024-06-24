import { IProduct } from './product.interface';

export interface IWishlist {
  id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  userId?: number;
  productId?: number;
  product?: IProduct;
}
