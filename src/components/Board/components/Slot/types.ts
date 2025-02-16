import { HTMLAttributes } from 'react';
import { Slot } from '../../store/Slot';

export type Props = HTMLAttributes<HTMLDivElement> & {
  model: Slot;
};
