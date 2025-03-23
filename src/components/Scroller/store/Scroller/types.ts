export type EventTypeMap = {
  scroll: VoidFunction;
  refChange: VoidFunction;
};

export type EventName = keyof EventTypeMap;

export type Options = {
  x?: number;
  y?: number;
  step?: number;
  autoScrollingEnabled?: boolean;
};
