import { Size } from 'src/types';

export const getElementSize = (element: HTMLElement): Size => {
  const rect = element.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
  };
};
