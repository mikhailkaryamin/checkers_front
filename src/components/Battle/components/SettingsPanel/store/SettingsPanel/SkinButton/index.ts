import { action, makeObservable, observable } from 'mobx';
import { DraughtsSkinType } from 'src/components/Battle/types';
import { Fade } from 'src/components/Fade/store/Fade';
import { Clicker } from 'src/shared/classes/Clicker';
import { Ref } from 'src/shared/classes/Ref';
import { Options } from './types';

export class SkinButton {
  public readonly ref = new Ref();

  public readonly skinType: DraughtsSkinType;

  public readonly hintHand = {
    fade: new Fade({ shown: false }),
  };

  public readonly clicker = new Clicker({ enabled: false });

  @observable
  protected _isActive = false;

  @observable
  protected _isSelected = false;

  protected readonly _pieceSpriteTypes: { [skinType in DraughtsSkinType]: string } = {
    default: 'defaultBlackKing',
    type1: 'blackKingType1',
    type2: 'blackKingType2',
  };

  public constructor(options: Options) {
    makeObservable(this);
    this.skinType = options.skinType;
  }

  public get isActive() {
    return this._isActive;
  }

  public get isSelected() {
    return this._isSelected;
  }

  public get pieceSpriteType() {
    return this._pieceSpriteTypes[this.skinType];
  }

  @action.bound
  public setIsSelected(isSelected: boolean) {
    this._isSelected = isSelected;
  }

  @action.bound
  public setIsActive(isActive: boolean) {
    this._isActive = isActive;
  }
}
