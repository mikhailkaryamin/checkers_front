import { Popup } from '../Popup';
import { Options } from './types';

export class MakeDrawPopup extends Popup {
  constructor(options: Options) {
    super({ bubbleType: 'makeDraw', buttonsType: 'yesNo', ...options });
  }
}
