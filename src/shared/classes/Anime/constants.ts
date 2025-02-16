import { eventNames as animationEventNames } from 'src/shared/classes/Animation/constants';
import { StrictRecord } from 'src/types';
import { EventName } from './types';

export const eventNames: StrictRecord<EventName> = {
  ...animationEventNames,
  update: 'update',
};
