import { action, makeObservable, observable } from 'mobx';
import { Board } from 'src/components/Board/store/Board';
import { Cell } from 'src/components/Board/store/Cell';
import { Nullable } from 'src/types';
import { Piece } from '../Piece';
import { defaultPieces } from './constants';
import {
  MoveData,
  Options,
  PieceData
} from './types';

export class Pieces {
  @observable
  protected _items: Piece[] = [];

  protected _chessBoard: Board;

  public constructor(options: Options) {
    makeObservable(this);
    this._chessBoard = options.chessBoard;
  }

  public get defaultChessPiecesData(): PieceData[] {
    return defaultPieces as PieceData[];
  }

  public get chessBoard() {
    return this._chessBoard;
  }

  public get all() {
    return this._items;
  }

  public setChessBoard(chessBoard: Board) {
    this._chessBoard = chessBoard;
  }

  public getChessPieces() {
    return this._items.filter((item) => item instanceof Piece) as Piece[];
  }

  public checkIfPieceOnBoard(piece: Piece) {
    const isPieceOnBoard = this._chessBoard.cellSlots.includes(piece.plate.slot);
    return isPieceOnBoard;
  }

  public getChessPiecesOnBoard() {
    return this.getChessPieces().filter((piece) =>
      this._chessBoard.cellSlots.includes(piece.plate.slot),
    );
  }

  public getChessPiecesOutsideBoard() {
    return this.getChessPieces().filter(
      (piece) => !this._chessBoard.cellSlots.includes(piece.plate.slot),
    );
  }

  public getPiecesOnBoard() {
    return this.all.filter((piece) => this._chessBoard.cellSlots.includes(piece.plate.slot));
  }

  public getPiecesOutsideBoard() {
    return this.all.filter((piece) => !this._chessBoard.cellSlots.includes(piece.plate.slot));
  }

  public findChessPieceBySquare(square: string) {
    const slot = this._chessBoard.getSlotBySquare(square);
    const piece = this.getChessPieces().find((item) => item.plate.slot === slot) ?? null;
    return piece;
  }

  public getChessPieceBySquare(square: string) {
    const piece = this.findChessPieceBySquare(square);
    this._throwErrorWhenPieceDoesNotExist(piece, square);
    return piece!;
  }

  public getBySquare(square: string) {
    const slot = this._chessBoard.getSlotBySquare(square);
    const piece = this._items.find((item) => item.plate.slot === slot) ?? null;
    this._throwErrorWhenPieceDoesNotExist(piece, square);

    return piece!;
  }

  public checkIfPieceInCellBySquare(square: string) {
    const slot = this._chessBoard.getSlotBySquare(square);
    const isPieceInCell = !!this._items.find((item) => item.plate.slot === slot);
    return isPieceInCell;
  }

  @action.bound
  public clearPieces() {
    this._items.forEach((item) => item.plate.prepareToUnmount());
    this._items = [];
  }

  @action.bound
  public removePiece(piece: Piece) {
    piece.plate.prepareToUnmount();
    this._items = this._items.filter((p) => p !== piece);
  }

  public async movePieceBySquares(params: MoveData) {
    const piece = this.getBySquare(params.startSquare);
    const slot = this._chessBoard.getCellBySquare(params.finishSquare);
    await this.movePieceToCell(piece, slot);
  }

  @action.bound
  public init() {
    this.clearPieces();

    const pieces = this.defaultChessPiecesData.map((itemData) => {
      const slot = this._chessBoard.getSlotBySquare(itemData.square);
      return new Piece({
        ...itemData,
        chessBoard: this._chessBoard,
        pieces: this,
        slot,
        slots: this._chessBoard.cellSlots,
        enabled: false
      });
    });

    this.setPieces(pieces);
  }

  @action.bound
  public setPieces(pieces: Piece[]) {
    this._items = pieces;
  }

  @action.bound
  public async eatPiece(piece: Piece, targetPiece: Piece) {
    await piece.plate.moveToSlot(targetPiece.plate.slot);
    this.destroyPiece(targetPiece);
  }

  public destroyPiece(piece: Piece) {
    piece.setIsImageVisible(false);
  }

  @action.bound
  public async movePieceToCell(piece: Piece, cell: Cell) {
    const pieceInCell = this.checkIfPieceInCellBySquare(cell.square)
      ? this.getChessPieceBySquare(cell.square)
      : null;

    if (pieceInCell && pieceInCell !== piece) {
      await this.eatPiece(piece, pieceInCell);
    } else {
      await piece.plate.moveToSlot(cell.slot);
    }
  }


  public async initAndShow() {
    this.init();
    await Promise.all(this.all.map((piece) => piece.fade.show()));
  }

  public async hideAndClear() {
    await Promise.all(this.all.map((piece) => piece.fade.hide()));
    this.clearPieces();
  }


  public preventDefaultAfterDragFinishHandler() {
    this.all.forEach((piece) => piece.plate.setAfterDragFinishHandler(null));
  }

  protected _throwErrorWhenPieceDoesNotExist(
    piece: Nullable<Piece>,
    square: string,
  ) {
    if (!piece) {
      throw new Error(`Piece at square ${square} does not exist`);
    }
  }
}
