import { eventNames as animationEventNames } from 'src/shared/classes/Animation/constants';
import { EventName } from './types';

export const eventNames: { [eventName in EventName]: eventName } = {
  ...animationEventNames,
  changed: 'changed',
  fadeEnd: 'fadeEnd',
};
