import { HTMLAttributes } from 'react';
import { Plate } from '../../store/Plate';

export type Props = HTMLAttributes<HTMLDivElement> & {
  model: Plate;
};
