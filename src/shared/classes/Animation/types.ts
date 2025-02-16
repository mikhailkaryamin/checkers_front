export type StartHandler = VoidFunction;
export type StopHandler = VoidFunction;
export type FinishHandler = VoidFunction;

export type EventTypeMap = {
  start: StartHandler;
  stop: StopHandler;
  finish: FinishHandler;
};

export type EventName = keyof EventTypeMap;

export type Options = {
  animating?: boolean;
};
