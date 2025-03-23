import { EnglishDraughtsGame } from 'rapid-draughts/english';
import { ChessSkinType } from 'src/components/Battle/types';
import { Fade } from 'src/components/Fade/store/Fade';
import { Clicker } from 'src/shared/classes/Clicker';
import { StorageStore } from 'src/store/StorageStore';
import { Nullable, Side } from 'src/types';
import { MoveHandler } from '../GameScenario/types';

export type GetCurrentDraughts = () => EnglishDraughtsGame;

export type Button = {
  fade: Fade;
  clicker: Clicker;
};

export type GameActionResult = 'gameOver' | 'resetButtonClick' | 'settingsButtonClick';

export type Options = {
  storage: StorageStore;
};

export type ShowOnGameParams = {
  fen: string;
  skinType: ChessSkinType;
  timer: Nullable<{ index: number; mainTime: number; extraTime: number }>;
};

export type StartHandler = VoidFunction;

export type ResetHandler = VoidFunction;

export type FinishData = {
  winnerSide: Side;
  playerSide: Side;
};
export type FinishHandler = (data: FinishData) => void;

export type EventTypeMap = {
  start: StartHandler;
  move: MoveHandler;
  reset: ResetHandler;
  finish: FinishHandler;
};
