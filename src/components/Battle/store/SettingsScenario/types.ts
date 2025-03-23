import { Chess } from 'src/components/Chess/store/Chess';
import { Done } from 'src/shared/classes/CancellableAction/types';
import { Side } from 'src/types';
import { SettingsPanel } from '../../components/SettingsPanel/store/SettingsPanel';
import { Background } from '../Background';
import { Timer } from '../Timer';

export type SideRadioClickActionData = { type: 'sideRadioClick'; index: number };
export type RuleRadioClickActionData = { type: 'ruleRadioClick'; index: number };
export type TimerRadioClickActionData = { type: 'timerRadioClick'; index: number };
export type DifficultyRadioClickActionData = { type: 'difficultyRadioClick'; index: number };
export type SkinButtonClickActionData = { type: 'skinButtonClick'; index: number };
export type SubmitButtonClickActionData = { type: 'submitButtonClick' };

export type ActionData =
  | DifficultyRadioClickActionData
  | SideRadioClickActionData
  | RuleRadioClickActionData
  | TimerRadioClickActionData
  | SkinButtonClickActionData
  | SubmitButtonClickActionData;

export type Options = {
  background: Background;
  chess: Chess;
  settingsPanel: SettingsPanel;
  timer: Timer;
  done?: Done<void>;
};

export type SettingOptions = {
  defaultSide?: Side;
  defaultSkinIndex?: number;
};

export type RunOptions = SettingOptions;
