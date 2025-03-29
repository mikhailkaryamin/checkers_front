import { DraughtsSkinType } from 'src/components/Battle/types';
import { Draughts } from 'src/components/Draughts/store/Draughts';
import { Nullable, Side } from 'src/types';
import { Background } from '../Background';
import { Timer } from '../Timer';

export type Options = {
  draughts: Draughts;
  timer: Timer;
  background: Background;
};

export type ToggleParams = {
  skinType: Nullable<DraughtsSkinType>;
  side: Nullable<Side>;
};
