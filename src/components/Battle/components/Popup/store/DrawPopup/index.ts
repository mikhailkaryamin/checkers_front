import { action, makeObservable } from 'mobx';
import { Popup } from '../Popup';
import { Options, ShowParams } from './types';

export class DrawPopup extends Popup {
  constructor(options: Options) {
    super({ bubbleType: 'draw', buttonsType: 'retry', scoreCount: 60, ...options });
    makeObservable(this);
  }

  @action.bound
  public async showWithSettings(params: ShowParams) {
    this.setScoreCount(params.scoreCount);
    await this.show();
  }
}
