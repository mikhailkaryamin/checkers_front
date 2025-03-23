import cn from 'classnames';
import { forwardRef } from 'react';
import { Block } from '../Block';
import styles from './index.module.scss';
import { Props } from './types';

export const Image = forwardRef<HTMLDivElement, Props>(function Image(props, ref) {
  const { className, src, ...otherProps } = props;

  return (
    <Block
      {...otherProps}
      ref={ref}
      style={{ ...otherProps.style, backgroundImage: `url(${src})` }}
      className={cn(styles.main, className)}
    />
  );
});
