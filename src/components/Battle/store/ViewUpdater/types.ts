import { ChessSkinType } from 'src/components/Battle/types';
import { Chess } from 'src/components/Chess/store/Chess';
import { Nullable, Side } from 'src/types';
import { Background } from '../Background';
import { Timer } from '../Timer';

export type Options = {
  chess: Chess;
  timer: Timer;
  background: Background;
};

export type ToggleParams = {
  skinType: Nullable<ChessSkinType>;
  side: Nullable<Side>;
};
