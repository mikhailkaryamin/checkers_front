import { EventName } from './types';

export const eventNames: { [eventName in EventName]: eventName } = {
  dragStart: 'dragStart',
  dragMove: 'dragMove',
  dragFinish: 'dragFinish',
};
