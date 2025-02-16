import { Point } from 'src/types';

export type DragStartData = {
  event: MouseEvent | TouchEvent;
  offsetPoint: Point;
  diffPoint: Point;
  element: HTMLElement;
};
export type DragStartHandler = (data: DragStartData) => void;
export type DragMoveData = {
  event: MouseEvent | TouchEvent;
  offsetPoint: Point;
  diffPoint: Point;
  element: HTMLElement;
};
export type DragMoveHandler = (data: DragMoveData) => void;
export type DragFinishData = {
  event: MouseEvent | TouchEvent;
  offsetPoint: Point;
  diffPoint: Point;
  element: HTMLElement;
  isBeyondClickOffset: boolean;
};
export type DragFinishHandler = (data: DragFinishData) => void;

export type EventTypeMap = {
  dragStart: DragStartHandler;
  dragMove: DragMoveHandler;
  dragFinish: DragFinishHandler;
};

export type EventName = keyof EventTypeMap;
