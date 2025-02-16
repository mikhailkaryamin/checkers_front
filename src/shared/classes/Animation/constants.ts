import { StrictRecord } from 'src/types';
import { EventName } from './types';

export const eventNames: StrictRecord<EventName> = {
  start: 'start',
  stop: 'stop',
  finish: 'finish',
};
