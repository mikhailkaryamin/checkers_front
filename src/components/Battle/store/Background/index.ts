import { action, makeObservable, observable } from 'mobx';
import defaultBackground from '../../components/Background/images/default.svg';
import type1 from '../../components/Background/images/type1.svg';
import type2 from '../../components/Background/images/type2.svg';
import { DraughtsSkinType } from '../../types';

export class Background {
  @observable
  protected _type: DraughtsSkinType = DraughtsSkinType.Default;

  protected readonly _sources = {
    default: defaultBackground,
    type1,
    type2,
  };

  public constructor(type: DraughtsSkinType) {
    makeObservable(this);
    this._type = type;
  }

  public get type() {
    return this._type;
  }

  public get src() {
    return this._sources[this.type];
  }

  @action.bound
  public setType(type: DraughtsSkinType) {
    this._type = type;
  }
}
