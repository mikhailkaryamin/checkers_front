import cn from 'classnames';
import { useDefaultProps } from 'src/shared/hooks/useDefaultProps';
import { defaultProps } from './constants';
import styles from './index.module.scss';
import { Props } from './types';

export const BackgroundImage = (props: Props) => {
  const { className, classNames, src, absolute, children, ...otherProps } = useDefaultProps(
    props,
    defaultProps,
  );

  return (
    <div
      {...otherProps}
      className={cn(styles.main, absolute && styles.main_absolute, className, classNames?.main)}
    >
      {src && <img className={cn(styles.image, classNames?.image)} src={src} draggable={false} />}
      <div className={cn(styles.image, classNames?.image)}>{children}</div>
    </div>
  );
};
