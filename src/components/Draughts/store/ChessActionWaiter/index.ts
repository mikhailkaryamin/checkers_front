import { DragFinishData, DragFinishHandler } from 'src/components/Board/store/Plate/types';
import { ClickHandler } from 'src/shared/classes/Clicker/types';
import { Deferred } from 'src/shared/classes/Deferred';
import { Nullable } from 'src/types';
import { Draughts } from '../Draughts';
import { Piece } from '../Piece';
import {
    ActionData,
    ClickCellActionData,
    ClickComputerPieceActionData,
    ClickPlayerPieceActionData,
    DragFinishActionData,
    DragFinishActionDataWithCell,
    Options,
} from './types';

export class ChessActionWaiter {
  protected _draughts: Draughts;

  protected _playerPieces: Piece[] = [];

  protected _computerPieces: Piece[] = [];

  protected _computerPiecesClickHandlers: ClickHandler[] = [];

  protected _playerPiecesDragFinishHandlers: DragFinishHandler[] = [];

  protected _playerPiecesClickHandlers: ClickHandler[] = [];

  protected _cellsClickHandlers: ClickHandler[] = [];

  protected _isRunning = false;

  protected _deferredEvent: Nullable<Deferred<ActionData<Piece>>> = null;

  public constructor(options: Options) {
    this._draughts = options.draughts;
  }

  public static checkIfClickPlayerPieceActionData<P extends Piece>(
    actionData: ActionData<P>,
  ): actionData is ClickPlayerPieceActionData<P> {
    return actionData.type === 'clickPlayerPiece';
  }

  public static checkIfDragFinishActionData<P extends Piece>(
    actionData: ActionData<P>,
  ): actionData is DragFinishActionData<P> {
    return actionData.type === 'dragFinish';
  }

  public static checkIfClickCellActionData<P extends Piece>(
    actionData: ActionData<P>,
  ): actionData is ClickCellActionData {
    return actionData.type === 'clickCell';
  }

  public static checkIfClickComputerPieceActionData<P extends Piece>(
    actionData: ActionData<P>,
  ): actionData is ClickComputerPieceActionData<P> {
    return actionData.type === 'clickComputerPiece';
  }

  public async wait<P extends Piece = Piece>(playerPieces: P[], computerPieces: P[]) {
    this._isRunning = true;
    this._deferredEvent = new Deferred<ActionData<P>>() as Deferred<ActionData<Piece>>;

    this._playerPieces = playerPieces;
    this._computerPieces = computerPieces;

    this._computerPiecesClickHandlers = computerPieces.map((piece) => () => {
      const cell = this._draughts.board.getCellBySlot(piece.plate.slot);
      this._deferredEvent?.resolve({ type: 'clickComputerPiece', piece, cell });
    });

    this._playerPiecesDragFinishHandlers = playerPieces.map((piece) => (data: DragFinishData) => {
      const isDrag = data.isBeyondClickOffset;

      if (isDrag) {
        const cell =
          data.mostIntersectedSlot && this._draughts.board.getCellBySlot(data.mostIntersectedSlot);

        this._deferredEvent?.resolve({ type: 'dragFinish', piece, cell });
      }
    });

    this._playerPiecesClickHandlers = playerPieces.map((piece) => () => {
      const cell = this._draughts.board.getCellBySlot(piece.plate.slot);
      this._deferredEvent?.resolve({ type: 'clickPlayerPiece', piece, cell });
    });

    this._cellsClickHandlers = this._draughts.board.cells.map((cell) => () => {
      this._deferredEvent?.resolve({ type: 'clickCell', cell });
    });

    this._listen();
    const event = await this._deferredEvent.promise;
    this.cancel();
    return event as ActionData<P>;
  }

  public cancel() {
    if (!this._isRunning) return;

    this._deferredEvent = null;

    this._computerPieces.forEach((piece, i) => {
      piece.clicker.events.off('click', this._computerPiecesClickHandlers[i]);
    });

    this._playerPieces.map((piece, i) => {
      piece.plate.events.off('dragFinish', this._playerPiecesDragFinishHandlers[i]);
      piece.clicker.events.off('click', this._playerPiecesClickHandlers[i]);
    });

    this._draughts.board.cells.forEach((cell, i) =>
      cell.clicker.events.off('click', this._cellsClickHandlers[i]),
    );

    this._isRunning = false;
  }

  public setChess(draughts: Draughts) {
    this._draughts = draughts;
  }

  public static checkIfActionWithTargetCell<P extends Piece>(
    actionData: ActionData<P>,
  ): actionData is
    | ClickCellActionData
    | DragFinishActionDataWithCell<P>
    | ClickComputerPieceActionData<P> {
    return (
      ChessActionWaiter.checkIfClickComputerPieceActionData(actionData) ||
      ChessActionWaiter.checkIfClickCellActionData(actionData) ||
      (ChessActionWaiter.checkIfDragFinishActionData(actionData) && !!actionData.cell)
    );
  }

  protected _listen() {
    this._computerPieces.forEach((piece, i) => {
      piece.clicker.events.on('click', this._computerPiecesClickHandlers[i]);
    });

    this._playerPieces.map((piece, i) => {
      piece.plate.events.on('dragFinish', this._playerPiecesDragFinishHandlers[i]);
      piece.clicker.events.on('click', this._playerPiecesClickHandlers[i]);
    });

    this._draughts.board.cells.forEach((cell, i) =>
      cell.clicker.events.on('click', this._cellsClickHandlers[i]),
    );
  }
}
