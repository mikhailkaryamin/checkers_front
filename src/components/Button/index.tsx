import React from 'react';
import cn from 'classnames';
import { useDefaultProps } from 'src/shared/hooks/useDefaultProps';
import { defaultProps } from './constants';
import styles from './index.module.scss';
import { Props } from './types';

export const Button = React.forwardRef(function Button(
  props: Props,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    color,
    className,
    classNames,
    disabled,
    hasPadding,
    isHoverable,
    children,
    onClick,
    ...otherProps
  } = useDefaultProps(props, defaultProps);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = React.useCallback(
    (event) => {
      if (!disabled) onClick?.(event);
    },
    [disabled],
  );

  return (
    <div
      {...otherProps}
      ref={ref}
      className={cn(
        styles.main,
        styles[`main_color_${color}`],
        disabled && styles.main_disabled,
        isHoverable && styles.main_hoverable,
        classNames?.main,
        className,
      )}
      onClick={handleClick}
    >
      <div className={cn(styles.content, hasPadding && styles.content_padded, classNames?.content)}>
        {children}
      </div>
    </div>
  );
});
