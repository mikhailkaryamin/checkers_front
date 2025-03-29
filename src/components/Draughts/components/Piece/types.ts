import { Props as BlockProps } from 'src/components/Block/types';
import { Piece } from '../../store/Piece';

export type Props = BlockProps & {
  model: Piece;
};
