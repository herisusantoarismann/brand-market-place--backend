import { ICategoryImage } from './category-image.interface';

export interface ICategory {
  id: number;
  name: string;
  description?: string;
  image: ICategoryImage;
}
