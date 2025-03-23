import { Cell } from 'src/components/Board/store/Cell';
import { Chess } from '../Chess';
import { Piece } from '../Piece';

export type Options = {
  chess: Chess;
};

export type ClickPlayerPieceActionData<P extends Piece = Piece> = {
  type: 'clickPlayerPiece';
  piece: P;
  cell: Cell;
};

export type DragFinishActionDataWithoutCell<P extends Piece = Piece> = {
  type: 'dragFinish';
  piece: P;
  cell: null;
};

export type DragFinishActionDataWithCell<P extends Piece = Piece> = {
  type: 'dragFinish';
  piece: P;
  cell: Cell;
};

export type DragFinishActionData<P extends Piece = Piece> =
  | DragFinishActionDataWithoutCell<P>
  | DragFinishActionDataWithCell<P>;

export type ClickCellActionData = {
  type: 'clickCell';
  cell: Cell;
};

export type ClickComputerPieceActionData<P extends Piece = Piece> = {
  type: 'clickComputerPiece';
  piece: P;
  cell: Cell;
};

export type ActionData<P extends Piece = Piece> =
  | ClickPlayerPieceActionData<P>
  | DragFinishActionData<P>
  | ClickCellActionData
  | ClickComputerPieceActionData<P>;
