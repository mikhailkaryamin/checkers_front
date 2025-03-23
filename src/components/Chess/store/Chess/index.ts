import { map } from 'lodash';
import { action, makeObservable, observable } from 'mobx';
import {
  EnglishDraughts as Draughts
} from 'rapid-draughts/english';
import { Board } from 'src/components/Board/store/Board';
import { ObjectEventWaiter } from 'src/shared/classes/ObjectEventWaiter';
import { wait } from 'src/shared/helpers/wait';
import { AnimatableValue } from '../AnimatableValue';
import { Pieces } from '../Pieces';
import { Difficulty, PositionValue } from './types';

export class Chess {
  public readonly pieces: Pieces;

  public readonly position = new AnimatableValue<PositionValue>('side');

  protected _board = new Board();

  @observable
  protected _engine = Draughts.setup();

  @observable
  protected _difficulty = Difficulty.Easy;

  protected readonly _cellClickWaiter = new ObjectEventWaiter();

  protected readonly _plateDragWaiter = new ObjectEventWaiter();

  protected readonly _pieceClickWaiter = new ObjectEventWaiter();

  constructor() {
    makeObservable(this);
    this.pieces = new Pieces({ chessBoard: this.board });
    this.board.disableCells();
  }

  public get board() {
    return this._board;
  }

  public get engine() {
    return this._engine;
  }

  public get difficulty() {
    return this._difficulty;
  }

  @action
  public resetEngine() {
    this._engine = Draughts.setup();
  }

  public clear() {
    this.cancelEventWaiters();
  }

  public cancelEventWaiters() {
    this._cellClickWaiter.cancel();
    this._plateDragWaiter.cancel();
    this._pieceClickWaiter.cancel();
  }

  public async createAndShowPieces() {
    this.pieces.init();
    await wait(100);
    await Promise.all(this.pieces.all.map((piece) => piece.fade.show()));
  }

  public async resetPieces() {
    await this.pieces.hideAndClear();
  }


  public async waitCellClick() {
    const eventData = await this._cellClickWaiter.wait(map(this.board.cells, 'clicker'), 'click');
    return eventData;
  }

  public async waitPiecePlateDragFinish() {
    const eventData = await this._plateDragWaiter.wait(map(this.pieces.all, 'plate'), 'dragFinish');
    return eventData;
  }

  public async waitPieceClick() {
    const eventData = await this._cellClickWaiter.wait(map(this.pieces.all, 'clicker'), 'click');
    return eventData;
  }

  @action
  public setDifficulty(value: Difficulty) {
    this._difficulty = value;
  }
}
