import { EventTypeMap as AnimationEventTypeMap } from 'src/shared/classes/Animation/types';

export type ChangedData = { shown: boolean };
export type ChangedHandler = (data: ChangedData) => void;
export type FadeEndData = { shown: boolean };
export type FadeEndHandler = (data: FadeEndData) => void;

export type EventTypeMap = AnimationEventTypeMap & {
  changed: ChangedHandler;
  fadeEnd: FadeEndHandler;
};

export type EventName = keyof EventTypeMap;

export type ShowParams = { duration?: number; delay?: number; easing?: string };

export type HideParams = ShowParams;

export type ToggleParams = ShowParams & { shown?: boolean };

export type Options = {
  shown?: boolean;
  duration?: number;
  delay?: number;
  easing?: string;
  hasUnmount?: boolean;
};
