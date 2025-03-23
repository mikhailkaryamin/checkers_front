import { Props as BlockProps } from 'src/components/Block/types';
import { Scroller } from './store/Scroller';

export type Props = BlockProps & {
  model?: Scroller;
  x?: number;
  y?: number;
  step?: number;
  autoScrollingEnabled?: boolean;
};
