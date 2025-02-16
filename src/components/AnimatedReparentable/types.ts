import { Props as ReparentableProps } from 'src/components/Block/types';
import { AnimatedReparentable } from './store/AnimatedReparentable';

export type Props = Omit<ReparentableProps, 'anchor'> & {
  model: AnimatedReparentable;
};
