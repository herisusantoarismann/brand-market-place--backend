import { IProduct } from './product.interface';

export interface IProductImage {
  id: number;
  url: string;
  productId?: number;
  product?: IProduct;
}
