import { StrictRecord } from 'src/types';
import BackSprite from './images/back.svg?react';
import CheckMarkSprite from './images/checkMark.svg?react';
import CrossSprite from './images/cross.svg?react';
import DinoSignSprite from './images/dinoSign.svg?react';
import FeedbackSprite from './images/feedback.svg?react';
import ForwardSprite from './images/forward.svg?react';
import FullscreenInSprite from './images/fullscreenIn.svg?react';
import FullscreenOutSprite from './images/fullscreenOut.svg?react';
import HeartSprite from './images/heart.svg?react';
import MusicOffSprite from './images/musicOff.svg?react';
import MusicOnSprite from './images/musicOn.svg?react';
import PlaySprite from './images/play.svg?react';
import RepeatSprite from './images/repeat.svg?react';
import { Color, Type } from './types';

export const types: StrictRecord<Type> = {
  play: 'play',
  back: 'back',
  forward: 'forward',
  fullscreenIn: 'fullscreenIn',
  fullscreenOut: 'fullscreenOut',
  musicOff: 'musicOff',
  musicOn: 'musicOn',
  feedback: 'feedback',
  repeat: 'repeat',
  heart: 'heart',
  dinoSign: 'dinoSign',
  checkMark: 'checkMark',
  cross: 'cross',
};

export const colors: StrictRecord<Color> = {
  white: 'white',
  purple: 'purple',
  orange: 'orange',
  blue: 'blue',
};

export const images = {
  [types.back]: BackSprite,
  [types.fullscreenIn]: FullscreenInSprite,
  [types.fullscreenOut]: FullscreenOutSprite,
  [types.musicOff]: MusicOffSprite,
  [types.musicOn]: MusicOnSprite,
  [types.play]: PlaySprite,
  [types.forward]: ForwardSprite,
  [types.feedback]: FeedbackSprite,
  [types.repeat]: RepeatSprite,
  [types.heart]: HeartSprite,
  [types.dinoSign]: DinoSignSprite,
  [types.checkMark]: CheckMarkSprite,
  [types.cross]: CrossSprite,
};

export const defaultProps = {
  type: types.back,
  color: colors.white,
  isInline: false,
};
