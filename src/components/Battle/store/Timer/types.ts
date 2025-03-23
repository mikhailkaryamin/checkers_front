import { Nullable } from 'src/types';

export type PositionValue = 'side' | 'outside';

export type WidthValue = 'stretched' | 'compressed';

export type Data = {
  mainTime: number;
  extraTime: number;
};

export type Options = {
  data?: Nullable<Data>;
};
