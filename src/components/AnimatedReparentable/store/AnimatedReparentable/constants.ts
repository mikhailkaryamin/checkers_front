import { eventNames as animeEventNames } from 'src/shared/classes/Anime/constants';
import { StrictRecord } from 'src/types';
import { EventName, PointHelper, TrajectoryHelper } from './types';

export const defaultTrajectoryHelper: TrajectoryHelper = ({ currentPoint }) => currentPoint;

export const defaultPointHelper: PointHelper = () => ({ x: 0, y: 0 });

export const eventNames: StrictRecord<EventName> = {
  ...animeEventNames,
  anchorChange: 'anchorChange',
};

export const getElementCenterPoint: PointHelper = ({ anchorSize, elementSize }) => {
  const point = {
    x: (anchorSize.width - elementSize.width) / 2,
    y: (anchorSize.height - elementSize.height) / 2,
  };

  return point;
};
