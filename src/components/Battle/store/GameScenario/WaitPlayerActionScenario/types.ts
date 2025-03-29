import { Chess } from 'src/components/Chess/store/Chess';

export type Options = {
  draughts: Chess;
};

export type GameStatus =
  | 'notStarted'
  | 'running'
  | 'cancelled'
  | 'draw'
  | 'playerLoss'
  | 'playerWin'
  | 'timeOver';
