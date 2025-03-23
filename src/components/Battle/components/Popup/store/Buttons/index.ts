import { action, makeObservable, observable } from 'mobx';
import { Clicker } from 'src/shared/classes/Clicker';
import { InitParams, Options, Type } from './types';

export class Buttons {
  @observable
  protected _type: Type;

  public readonly retry = {
    clicker: new Clicker(),
  };

  public readonly next = {
    clicker: new Clicker(),
  };

  public readonly yes = {
    clicker: new Clicker(),
  };

  public readonly no = {
    clicker: new Clicker(),
  };

  public constructor(options?: Options) {
    makeObservable(this);
    this._type = options?.type ?? 'retry';
  }

  public get type() {
    return this._type;
  }

  @action.bound
  public setType(type: Type) {
    this._type = type;
  }

  @action.bound
  public init(params: InitParams) {
    this.setType(params.type ?? this.type);
  }
}
