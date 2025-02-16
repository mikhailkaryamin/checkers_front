import { EventTypeMap as AnimationEventTypeMap } from 'src/shared/classes/Animation/types';

export type EventTypeMap = AnimationEventTypeMap & {
  update: VoidFunction;
};

export type EventName = keyof EventTypeMap;
