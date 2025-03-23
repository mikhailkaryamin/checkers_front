import { StrictRecord } from 'src/types';
import { Color } from './types';

export const colors: StrictRecord<Color> = {
  'orange': 'orange',
  'white': 'white',
  'purple': 'purple',
  'white-orange': 'white-orange',
};

export const defaultProps = {
  color: colors.white as Color,
  disabled: false,
  hasPadding: true,
  isHoverable: true,
};
