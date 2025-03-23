import React from 'react';
import cn from 'classnames';
import { useDefaultProps } from 'src/shared/hooks/useDefaultProps';
import { Icon } from '../Icon';
import { defaultProps } from './constants';
import styles from './index.module.scss';
import { Props } from './types';

export const IconButton = React.forwardRef(function IconButton(
  props: Props,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, disabled, color, type, isInline, onClick, ...otherProps } = useDefaultProps(
    props,
    defaultProps,
  );

  const handleClick: React.MouseEventHandler<HTMLDivElement> = React.useCallback(
    (event) => {
      if (!disabled) onClick?.(event);
    },
    [disabled, onClick],
  );

  return (
    <div
      {...otherProps}
      ref={ref}
      className={cn(styles.main, disabled && styles.main_disabled, className)}
      onClick={handleClick}
    >
      <Icon className={styles.icon} type={type} color={color} isInline={isInline} />
    </div>
  );
});
