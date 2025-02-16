import { EventTypeMap as AnimeEventTypeMap } from 'src/shared/classes/Anime/types';
import { Nullable, Point, Size } from 'src/types';

export type TrajectoryHelper = (params: {
  startPoint: Point;
  currentPoint: Point;
  finishPoint: Point;
}) => Point;

export type PointHelper = (params: { elementSize: Size; anchorSize: Size }) => Point;

export type AnchorChangeData = { anchor: Nullable<HTMLElement> };
export type AnchorChangeHandler = (dataA: AnchorChangeData) => void;
export type ReparentAnimationEndHandler = VoidFunction;

export type EventTypeMap = AnimeEventTypeMap & {
  anchorChange: AnchorChangeHandler;
};

export type EventName = keyof EventTypeMap;

export type Options = {
  anchor?: Nullable<HTMLElement>;
  duration?: number;
  delay?: number;
  easing?: string;
  trajectoryHelper?: TrajectoryHelper;
  pointHelper?: PointHelper;
};
