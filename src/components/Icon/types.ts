import React from 'react';

export type Type =
  | 'back'
  | 'forward'
  | 'fullscreenIn'
  | 'fullscreenOut'
  | 'musicOff'
  | 'musicOn'
  | 'play'
  | 'feedback'
  | 'repeat'
  | 'heart'
  | 'dinoSign'
  | 'checkMark'
  | 'cross';

export type Color = 'white' | 'purple' | 'orange' | 'blue';

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  color?: Color;
  type?: Type;
  isInline?: boolean;
};
