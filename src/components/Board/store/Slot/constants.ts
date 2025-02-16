import { StrictRecord } from 'src/types';
import { EventName } from './types';

export const eventNames: StrictRecord<EventName> = {
  set: 'set',
  unset: 'unset',
  enter: 'enter',
  leave: 'leave',
};
