import { action, makeObservable } from 'mobx';
import { Popup } from '../Popup';
import { Options, ShowParams } from './types';

export class WinPopup extends Popup {
  constructor(options: Options) {
    super({
      buttonsType: 'retry',
      scoreCount: 100,
      bubbleType: 'win',
      ...options,
    });
    makeObservable(this);
  }

  @action.bound
  public async showWithSettings(params: ShowParams) {
    this.setPlayerSide(params.playerSide);
    await this.show();
  }
}
