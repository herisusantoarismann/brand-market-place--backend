import { IBrand } from './brand.interface';

export interface IBrandImage {
  id: number;
  name: string;
  url: string;
  brandId?: number;
  brand?: IBrand;
}
