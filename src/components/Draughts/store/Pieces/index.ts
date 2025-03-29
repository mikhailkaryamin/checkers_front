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

  protected _draughtsBoard: Board;

  public constructor(options: Options) {
    makeObservable(this);
    this._draughtsBoard = options.draughtsBoard;
  }

  public get defaultDraughtsPiecesData(): PieceData[] {
    return defaultPieces as PieceData[];
  }

  public get draughtsBoard() {
    return this._draughtsBoard;
  }

  public get all() {
    return this._items;
  }

  public setDraughtsBoard(draughtsBoard: Board) {
    this._draughtsBoard = draughtsBoard;
  }

  public getDraughtsPieces() {
    return this._items.filter((item) => item instanceof Piece) as Piece[];
  }

  public checkIfPieceOnBoard(piece: Piece) {
    const isPieceOnBoard = this._draughtsBoard.cellSlots.includes(piece.plate.slot);
    return isPieceOnBoard;
  }

  public getDraughtsPiecesOnBoard() {
    return this.getDraughtsPieces().filter((piece) =>
      this._draughtsBoard.cellSlots.includes(piece.plate.slot),
    );
  }

  public getDraughtsPiecesOutsideBoard() {
    return this.getDraughtsPieces().filter(
      (piece) => !this._draughtsBoard.cellSlots.includes(piece.plate.slot),
    );
  }

  public getPiecesOnBoard() {
    return this.all.filter((piece) => this._draughtsBoard.cellSlots.includes(piece.plate.slot));
  }

  public getPiecesOutsideBoard() {
    return this.all.filter((piece) => !this._draughtsBoard.cellSlots.includes(piece.plate.slot));
  }

  public findDraughtsPieceBySquare(square: string) {
    const slot = this._draughtsBoard.getSlotBySquare(square);
    const piece = this.getDraughtsPieces().find((item) => item.plate.slot === slot) ?? null;
    return piece;
  }

  public getDraughtsPieceBySquare(square: string) {
    const piece = this.findDraughtsPieceBySquare(square);
    this._throwErrorWhenPieceDoesNotExist(piece, square);
    return piece!;
  }

  public getBySquare(square: string) {
    const slot = this._draughtsBoard.getSlotBySquare(square);
    const piece = this._items.find((item) => item.plate.slot === slot) ?? null;
    this._throwErrorWhenPieceDoesNotExist(piece, square);

    return piece!;
  }

  public checkIfPieceInCellBySquare(square: string) {
    const slot = this._draughtsBoard.getSlotBySquare(square);
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
    const slot = this._draughtsBoard.getCellBySquare(params.finishSquare);
    await this.movePieceToCell(piece, slot);
  }

  @action.bound
  public init() {
    this.clearPieces();

    const pieces = this.defaultDraughtsPiecesData.map((itemData) => {
      const slot = this._draughtsBoard.getSlotBySquare(itemData.square);
      return new Piece({
        ...itemData,
        draughtsBoard: this._draughtsBoard,
        pieces: this,
        slot,
        slots: this._draughtsBoard.cellSlots,
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
      ? this.getDraughtsPieceBySquare(cell.square)
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
