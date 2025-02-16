import { Point, Size } from 'src/types';

export const getIntersectionArea = (rect1: Point & Size, rect2: Point & Size): Point & Size => {
  const x = Math.max(rect1.x, rect2.x);
  const y = Math.max(rect1.y, rect2.y);
  const xx = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
  const yy = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
  const width = xx - x;
  const height = yy - y;

  if (width <= 0 || height <= 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  return { x, y, width: xx - x, height: yy - y };
};
