import { uniqueId } from 'lodash';
import { action, makeObservable, observable } from 'mobx';
import { DraughtsPlayer } from 'rapid-draughts';
import { Board } from 'src/components/Board/store/Board';
import { Plate } from 'src/components/Board/store/Plate';
import { Fade } from 'src/components/Fade/store/Fade';
import { Clicker } from 'src/shared/classes/Clicker';
import { Side } from 'src/types';
import { Pieces } from '../Pieces';
import { Options } from './types';

export class Piece {
  public readonly plate: Plate;

  public readonly fade: Fade;

  public readonly id = uniqueId();

  public readonly fadedHintHand = new Fade({ shown: false, duration: 300, hasUnmount: true });

  public readonly clicker: Clicker;

  protected readonly _chessBoard: Board;

  protected readonly _pieces: Pieces;

  @observable
  protected _isImageVisible = true;

  @observable
  protected _isHovered = false;

  @observable
  protected _isHoverable = false;

  @observable
  protected _isRotated = false;

  protected _side: Side;

  @observable
  protected _isKing = false;

  public constructor(options: Options) {
    makeObservable(this);
    this.plate = new Plate({
      slot: options.slot,
      slots: options.slots,
      enabled: options.enabled,
      isDragByClickEnabled: false,
    });
    this.fade = new Fade({ shown: options.isShown });
    this.clicker = new Clicker({ enabled: options.enabled });
    this._chessBoard = options.chessBoard;
    this._pieces = options.pieces;
    this._side = options.side;
    this.plate.events.on('dragStart', this.handleDragStart);
    this.plate.events.on('dragFinish', this.handleDragFinish);
  }

  public get cell() {
    return this.getCell();
  }

  public get isHovered() {
    return this._isHovered;
  }

  public get isHoverable() {
    return this._isHoverable;
  }

  public get isAnimating() {
    return this.plate.animating;
  }

  public get isDragging() {
    return this.plate.isDragging;
  }

  public get isImageVisible() {
    return this._isImageVisible;
  }

  public get isRotated() {
    return this._isRotated;
  }

  public get isLight() {
    return this._side === DraughtsPlayer.LIGHT;
  }

  public get isDark() {
    return this._side === DraughtsPlayer.DARK;
  }

  public get pieceColor() {
    return this._side;
  }

  public get isKing() {
    return this._isKing;
  }

  @action.bound
  public setIsHovered(isHovered: boolean) {
    this._isHovered = isHovered;
  }

  @action.bound
  public setIsHoverable(isHoverable: boolean) {
    this._isHoverable = isHoverable;
  }

  @action.bound
  public setIsRotated(isRotated: boolean) {
    this._isRotated = isRotated;
  }

  @action.bound
  public setIsImageVisible(isImageVisible: boolean) {
    this._isImageVisible = isImageVisible;
  }

  @action.bound
  public turnToKing() {
    this._isKing = true;
  }

  @action.bound
  public handleDragStart() {
    this.setIsRotated(true);
  }

  @action.bound
  public handleDragFinish() {
    this.setIsRotated(false);
  }

  public getCell() {
    return this._chessBoard.getCellBySlot(this.plate.slot);
  }
}
