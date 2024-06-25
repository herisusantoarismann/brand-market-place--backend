import { IProduct } from './product.interface';

export interface IReview {
  id: number;
  userId?: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  content: string;
  rating: number;
  productId?: number;
  product?: IProduct;
}
