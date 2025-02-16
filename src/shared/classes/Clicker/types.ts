export type ClickHandler = VoidFunction;

export type EventTypeMap = {
  click: ClickHandler;
};

export type EventName = keyof EventTypeMap;

export type Options = {
  enabled?: boolean;
};
