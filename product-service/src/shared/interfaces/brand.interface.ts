import { IBrandImage } from './brand-image.interface';

export interface IBrand {
  id: number;
  name: string;
  description?: string;
  image: IBrandImage;
}
