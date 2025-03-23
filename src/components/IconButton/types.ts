import React from 'react';
import { Color, Type } from '../Icon/types';

export type { Color } from '../Icon/types';

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  color?: Color;
  type?: Type;
  disabled?: boolean;
};
