import { defaultProps as blockDefaultProps } from '../Block/constants';

export const defaultProps = {
  ...blockDefaultProps,
  shown: true,
  duration: 500,
  delay: 0,
  easing: 'ease-in-out',
  hasUnmount: false,
  isUsingRef: true,
};
