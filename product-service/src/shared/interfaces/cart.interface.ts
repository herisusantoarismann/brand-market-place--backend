import { ICartItem } from './cart-item.interface';

export interface ICart {
  id: number;
  items: ICartItem[];
}
