import { Point } from 'src/types';

export const getPointByRelativeElement = (
  element: HTMLElement,
  relativeElement: HTMLElement,
): Point => {
  const relativeElementRect = relativeElement.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return {
    x: elementRect.left - relativeElementRect.left,
    y: elementRect.top - relativeElementRect.top,
  };
};
