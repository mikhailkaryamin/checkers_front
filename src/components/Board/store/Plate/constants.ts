import { eventNames as animatedReparentableEventNames } from 'src/components/AnimatedReparentable/store/AnimatedReparentable/constants';
import { eventNames as dragStarterEventNames } from 'src/shared/classes/DragStarter/constants';
import { StrictRecord } from 'src/types';
import { EventName } from './types';

export const eventNames: StrictRecord<EventName> = {
  ...animatedReparentableEventNames,
  ...dragStarterEventNames,
  set: 'set',
  unset: 'unset',
  enter: 'enter',
  leave: 'leave',
};
