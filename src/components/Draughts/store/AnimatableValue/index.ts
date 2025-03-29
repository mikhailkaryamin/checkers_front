import { action, makeObservable, observable } from 'mobx';
import { Animation } from 'src/shared/classes/Animation';

export class AnimatableValue<V extends string> {
  public readonly animation = new Animation();

  @observable
  protected _value: V;

  public constructor(value: V) {
    makeObservable(this);
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  @action.bound
  public setValue(value: V) {
    this._value = value;
  }

  public async animateValue(value: V) {
    if (this._value === value) return;
    this.setValue(value);
    this.animation.start();
    await this.animation.waitWhenAnimating();
  }
}
