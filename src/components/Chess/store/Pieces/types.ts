import { Board } from 'src/components/Board/store/Board';
import { Side } from 'src/types';

export type MoveData = {
  startSquare: string;
  finishSquare: string;
};

export type PieceData = {
  square: string;
  side: Side;
};

export type Options = {
  chessBoard: Board;
};
