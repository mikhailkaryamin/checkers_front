import { Type as ButtonsType } from 'src/components/Battle/components/Popup/store/Buttons/types';
import { Nullable, Side } from 'src/types';

export type BubbleType =
  | 'win'
  | 'loss'
  | 'draw'
  | 'makeDraw';

export type Options = {
  isShown?: boolean;
  playerSide: Side;
  scoreCount?: number;
  bubbleType?: Nullable<BubbleType>;
  buttonsType?: ButtonsType;
};
