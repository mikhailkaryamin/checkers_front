import React from 'react';
import { Nullable } from 'src/types';

export type Props = Omit<
  React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  'src'
> & {
  classNames?: {
    main?: string;
    image?: string;
  };
  src?: Nullable<string>;
  absolute?: boolean;
};
