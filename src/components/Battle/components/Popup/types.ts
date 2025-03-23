import { Props as BlockProps } from 'src/components/Block/types';
import { Popup } from './store/Popup';

export type Props = BlockProps & {
  classNames?: {
    main?: string;
    panel?: string;
  };
  model: Popup;
};
