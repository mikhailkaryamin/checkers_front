import { action, makeObservable, observable } from 'mobx';
import { Clicker } from 'src/shared/classes/Clicker';
import { Options } from './types';

export class Radio {
  public readonly clicker = new Clicker({ enabled: false });

  public readonly content: string;

  @observable
  protected _isSelected = false;

  public constructor(options: Options) {
    makeObservable(this);
    this.content = options.content;
  }

  public get isSelected() {
    return this._isSelected;
  }

  @action.bound
  public setIsSelected(isSelected: boolean) {
    this._isSelected = isSelected;
  }
}
