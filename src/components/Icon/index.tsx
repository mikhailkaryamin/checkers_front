import React from 'react';
import cn from 'classnames';
import { useDefaultProps } from 'src/shared/hooks/useDefaultProps';
import { Block } from '../Block';
import { defaultProps, images } from './constants';
import styles from './index.module.scss';
import { Props } from './types';

export const Icon = React.forwardRef(function Icon(
  props: Props,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, color, type, isInline, ...otherProps } = useDefaultProps(props, defaultProps);
  const Sprite = images[type];

  return (
    <Block
      {...otherProps}
      ref={ref}
      className={cn(
        styles.main,
        styles[`main_color_${color}`],
        isInline && styles.main_isInline,
        className,
      )}
      fullSize
    >
      <Sprite />
    </Block>
  );
});
