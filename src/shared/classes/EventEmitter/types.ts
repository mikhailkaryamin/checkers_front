export type EventTypeMap = {
  [eventType in string | symbol]: (...args: any[]) => any;
};
