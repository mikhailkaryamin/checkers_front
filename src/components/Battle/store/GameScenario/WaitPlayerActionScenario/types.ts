import { Draughts } from 'src/components/Draughts/store/Draughts';

export type Options = {
  draughts: Draughts;
};

export type GameStatus =
  | 'notStarted'
  | 'running'
  | 'cancelled'
  | 'draw'
  | 'playerLoss'
  | 'playerWin'
  | 'timeOver';
