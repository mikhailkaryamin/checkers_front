import { EventTypeMap } from '../EventEmitter/types';

export type EventData<T extends EventTypeMap> = {
  index: number;
  eventType: keyof T;
  args: Parameters<T[keyof T]>;
};
