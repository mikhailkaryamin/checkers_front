import { makeObservable, observable } from 'mobx';
import { Fade } from 'src/components/Fade/store/Fade';
import { Direction } from '../types';

export class Sign {
  public readonly value: string;

  public readonly direction: Direction;

  public readonly index: number;

  public readonly fade: Fade;

  public readonly valueFade: Fade;

  @observable
  protected _isSelected = false;

  @observable
  protected _isSeparateArrowControl = false;

  public constructor(options: {
    value: string;
    direction: Direction;
    index: number;
    isVisible?: boolean;
    isSelected?: boolean;
    hasArrow?: boolean;
  }) {
    makeObservable(this);
    this.value = options.value;
    this.direction = options.direction;
    this.index = options.index;
    this.fade = new Fade({ shown: options.isVisible ?? true, duration: 200, hasUnmount: true });
    this.valueFade = new Fade({
      shown: options.isVisible ?? true,
      duration: 200,
      hasUnmount: true,
    });
  }
}
