import { action, makeObservable, observable } from 'mobx';
import { Animation } from 'src/shared/classes/Animation';
import { Clicker } from 'src/shared/classes/Clicker';
import { CheckerPoint, Nullable, Point, Side } from 'src/types';
import { verticalSigns } from '../../constants';
import { Slot } from '../Slot';
import { Options, SelectionType } from './types';

export class Cell {
  public readonly coordinate: Point;

  public readonly color: Side;

  public readonly slot = new Slot();

  public readonly clicker = new Clicker();

  public readonly selectionTypeAnimation = new Animation();

  @observable
  protected _hoverable = true;

  @observable
  protected _hovered = false;

  @observable
  protected _selectionType: Nullable<SelectionType> = null;

  public constructor(options: Options) {
    makeObservable(this);
    this.coordinate = options.coordinate;
    this.color = options.color;
    this._selectionType = options.selectionType ?? this._selectionType;
    this._hoverable = options.hoverable ?? this._hoverable;
    this._hovered = options.hovered ?? this._hovered;
    this.clicker.activity.toggle(options.isEnabled ?? true);
  }

  public get selectionType() {
    return this._selectionType;
  }

  public get hoverable() {
    return this._hoverable;
  }

  public get hovered() {
    return this._hovered;
  }

  public get chessPoint() {
    const chessPoint: CheckerPoint = {
      v: verticalSigns[this.coordinate.x],
      h: String(8 - this.coordinate.y),
    };
    return chessPoint;
  }

  public get square() {
    return `${this.chessPoint.v}${this.chessPoint.h}`;
  }

  @action.bound
  public setSelectionType(selectionType: Nullable<SelectionType>) {
    this._selectionType = selectionType;
  }

  @action.bound
  public async animateSelectionType(selectionType: Nullable<SelectionType>) {
    if (this._selectionType === selectionType) return;

    this.selectionTypeAnimation.start();
    this.setSelectionType(selectionType);
    await this.selectionTypeAnimation.waitWhenAnimating();
  }

  @action.bound
  public setHoverable(hoverable: boolean) {
    this._hoverable = hoverable;
  }

  @action.bound
  public setHovered(hovered: boolean) {
    this._hovered = hovered;
  }

  @action.bound
  public reset() {
    this.slot.resetElement();
    this.setHoverable(true);
    this.setHovered(false);
    this._selectionType = null;
  }
}
