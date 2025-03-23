import BubbleSpriteDraw from './images/bubbleDraw.svg?react';
import BubbleSpriteLoss from './images/bubbleLoss.svg?react';
import BubbleSpriteMakeDraw from './images/bubbleMakeDraw.svg?react';
import BubbleSpriteWin from './images/bubbleWin.svg?react';

export const bubbleOptions = {
  win: {
    light: {
      text: `Ура! Победа белых!`,
    },
    dark: {
      text: `Ура! Победа чёрных!`,
    },
    Image: BubbleSpriteWin,
  },

  loss: {
    light: {
      text: `Победа чёрных.
        Попробуешь
        ещё раз?`,
    },
    dark: {
      text: `Победа белых.
        Попробуешь
        ещё раз?`,
    },
    Image: BubbleSpriteLoss,
  },
  draw: {
    text: `Ничья. Может,
    ещё одну партию?`,
    Image: BubbleSpriteDraw,
  },
  makeDraw: {
    text: `Хочешь объявить
    ничью?`,
    Image: BubbleSpriteMakeDraw,
  },
};
