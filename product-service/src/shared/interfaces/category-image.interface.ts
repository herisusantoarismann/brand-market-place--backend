import { ICategory } from './category.interface';

export interface ICategoryImage {
  id: number;
  url: string;
  categoryId?: number;
  category?: ICategory;
}
