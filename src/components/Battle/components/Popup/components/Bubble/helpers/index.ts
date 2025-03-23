import { Side } from 'src/types';
import { BubbleType } from '../../../store/Popup/types';
import { bubbleOptions } from '../constants';

export const getBubbleOptions = (bubbleType: BubbleType, playerSide: Side) => {
  if (
    bubbleType !== 'draw' &&
    bubbleType !== 'makeDraw'
  ) {
    return {
      text: bubbleOptions[bubbleType][playerSide].text,
      Image: bubbleOptions[bubbleType].Image,
    };
  }
  return {
    text: bubbleOptions[bubbleType].text,
    Image: bubbleOptions[bubbleType].Image,
  };
};
