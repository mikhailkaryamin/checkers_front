import { action, makeObservable, observable } from 'mobx';
import { Fade } from 'src/components/Fade/store/Fade';
import { waitFirstClicker } from 'src/shared/helpers/waitFirstClicker';
import { Nullable, Side } from 'src/types';
import { getBubbleOptions } from '../../components/Bubble/helpers';
import { Buttons } from '../Buttons';
import { BubbleType, Options } from './types';

export class Popup {
  public readonly fade: Fade;

  public buttons = new Buttons();

  @observable
  protected _scoreCount: number;

  @observable
  protected _bubbleType: Nullable<BubbleType>;

  @observable
  protected _playerSide: Side;

  public constructor(options: Options) {
    makeObservable(this);
    this.fade = new Fade({ shown: options.isShown ?? false, hasUnmount: true });

    this._bubbleType = options.bubbleType ?? null;
    this._playerSide = options.playerSide;
    this._scoreCount = options.scoreCount ?? 0;

    if (options.buttonsType) {
      this.buttons.setType(options.buttonsType);
    }
  }

  public get bubbleType() {
    return this._bubbleType;
  }

  public get playerSide() {
    return this._playerSide;
  }

  public get scoreCount() {
    return this._scoreCount;
  }

  protected get _bubbleData() {
    if (!this.bubbleType) return null;
    return getBubbleOptions(this.bubbleType, this.playerSide);
  }

  @action.bound
  public async hide() {
    await this.fade.hide();
  }

  @action.bound
  public async show() {
    await this.fade.show();
  }

  @action.bound
  public setBubbleType(bubbleType: Nullable<BubbleType>) {
    this._bubbleType = bubbleType;
  }

  @action.bound
  public setScoreCount(scoreCount: number) {
    this._scoreCount = scoreCount;
  }

  @action.bound
  public setPlayerSide(side: Side) {
    this._playerSide = side;
  }

  public async waitButtonClick() {
    const { index } = await waitFirstClicker([
      this.buttons.retry.clicker,
      this.buttons.next.clicker,
      this.buttons.yes.clicker,
      this.buttons.no.clicker,
    ]);

    if (index === 0) return 'repeatButton';
    if (index === 1) return 'nextButton';
    if (index === 2) return 'yesButton';
    return 'noButton';
  }
}
