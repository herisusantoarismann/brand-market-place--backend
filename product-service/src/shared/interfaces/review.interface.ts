import { IProduct } from './product.interface';

export interface IReview {
  id: number;
  userId: number;
  content: string;
  rating: number;
  productId?: number;
  product?: IProduct;
}
