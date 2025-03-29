import { Chess } from 'src/components/Chess/store/Chess';
import { EventTypeMap as CancellableActionEventTypeMap } from 'src/shared/classes/CancellableAction/types';
import { SoundManager } from '../SoundManager';
import { Timer } from '../Timer';

export type Options = {
  draughts: Chess;
  timer: Timer;
  soundManager: SoundManager;
};

export type MoveParams = {
  startSquare: string;
  finishSquare: string;
};

export type MoveData = {
  index: number;
  pieceColor: string;
  pieceType: string;
  startSquare: string;
  finishSquare: string;
};

export type MoveHandler = (data: MoveData) => void;

export type EventTypeMap = CancellableActionEventTypeMap<void, void> & {
  move: MoveHandler;
};

export type PointPath =  {
  y: number;
  x: number;
}
