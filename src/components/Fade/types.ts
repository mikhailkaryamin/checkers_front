import { Props as BlockProps } from '../Block/types';
import { Fade } from './store/Fade';
import { FadeEndHandler } from './store/Fade/types';

export type Props = BlockProps & {
  model?: Fade;
  hasUnmount?: boolean;
  shown?: boolean;
  duration?: number;
  delay?: number;
  easing?: string;
  isUsingRef?: boolean;
  onFadeEnd?: FadeEndHandler;
};
