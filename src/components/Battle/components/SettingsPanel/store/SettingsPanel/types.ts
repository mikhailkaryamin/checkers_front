import { DraughtsSkinType } from 'src/components/Battle/types';
import { Radio } from './Radio';
import { SkinButton } from './SkinButton';

export type PositionValue = 'side' | 'corner';

export type SkinButtonsData = {
  skinType: DraughtsSkinType;
}[];

export type SkinButtons = SkinButton[];

export type TimerRadios = {
  timerNo: Radio;
  timer10: Radio;
  timer15: Radio;
  timer30: Radio;
};

export type RuleRadios = {
  wcdf: Radio;
};

export type DifficultyRadios = {
  easy: Radio;
  medium: Radio;
  hard: Radio;
}

export type Options = {
  skinTypes?: DraughtsSkinType[];
};
