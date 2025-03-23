import { Point, Position } from 'src/types';

export const getPositionFromPoint = (point: Point): Position => ({
  left: point.x,
  top: point.y,
});
