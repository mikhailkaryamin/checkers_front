import { ChessPieceSkinType } from 'src/components/Battle/types';
import { Side } from 'src/types';

export type Options = {
  isShown?: boolean;
  skinType: ChessPieceSkinType;
  playerSide: Side;
};
