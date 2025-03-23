import { action, makeObservable } from 'mobx';
import { Popup } from '../Popup';
import { Options, ShowParams } from './types';

export class LossPopup extends Popup {
  constructor(options: Options) {
    super({ bubbleType: 'loss', buttonsType: 'retry', scoreCount: 40, ...options });
    makeObservable(this);
  }

  @action.bound
  public async showWithSettings(params: ShowParams) {
    this.setScoreCount(params.scoreCount);
    this.setPlayerSide(params.playerSide);
    await this.show();
  }
}
