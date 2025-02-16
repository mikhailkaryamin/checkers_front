import React from 'react';
import { Point } from 'src/types';

export const getPagePointByEvent = (
  event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent,
): Point => {
  if ('pageX' in event) return { x: event.pageX, y: event.pageY };
  return { x: event.changedTouches[0].pageX, y: event.changedTouches[0].pageY };
};
