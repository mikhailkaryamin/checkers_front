import { action, makeObservable, observable } from 'mobx';

export class ExtraTimer {
  @observable
  protected _isShown: boolean;

  @observable
  protected _value: number;

  public constructor(options: { isShown: boolean; value: number }) {
    makeObservable(this);
    this._isShown = options.isShown;
    this._value = options.value;
  }

  public get isShown() {
    return this._isShown;
  }

  public get value() {
    return this._value;
  }

  public get second() {
    return this._value / 1000;
  }

  @action.bound
  public setIsShown(isShown: boolean) {
    this._isShown = isShown;
  }

  @action.bound
  public setValue(value: number) {
    this._value = value;
  }

  public update(value: number) {
    this.setIsShown(value !== 0);
    this.setValue(value);
  }
}
