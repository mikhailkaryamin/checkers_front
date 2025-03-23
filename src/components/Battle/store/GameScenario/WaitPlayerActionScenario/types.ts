import { Chess } from 'src/components/Chess/store/Chess';

export type Options = {
  chess: Chess;
};

export type GameStatus =
  | 'notStarted'
  | 'running'
  | 'cancelled'
  | 'draw'
  | 'playerLoss'
  | 'playerWin'
  | 'timeOver';
