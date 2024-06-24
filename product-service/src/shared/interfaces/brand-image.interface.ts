import { IBrand } from './brand.interface';

export interface IBrandImage {
  id: number;
  url: string;
  brandId?: number;
  brand?: IBrand;
}
