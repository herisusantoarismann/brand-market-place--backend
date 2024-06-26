import { IProduct } from './product.interface';

export interface ICartItem {
  id: number;
  cartId?: number;
  productId?: number;
  product: IProduct;
  quantity: number;
}
