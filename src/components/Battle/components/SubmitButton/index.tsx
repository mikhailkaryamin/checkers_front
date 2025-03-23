import cn from 'classnames';
import { Button } from 'src/components/Button';
import CheckMarkSprite from './images/checkMark.svg?react';
import styles from './index.module.scss';
import { Props } from './types';

export const SubmitButton = (props: Props) => {
  const { className, isEnabled, ...otherProps } = props;

  return (
    <Button
      {...otherProps}
      className={cn(styles.main, isEnabled && styles.main_isEnabled, className)}
      classNames={{ content: styles.content }}
      color="orange"
      disabled={!isEnabled}
      hasPadding={false}
    >
      <CheckMarkSprite />
    </Button>
  );
};
