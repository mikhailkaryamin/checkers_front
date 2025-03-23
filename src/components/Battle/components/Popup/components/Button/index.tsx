import { Button as BaseButton } from 'src/components/Button';
import NextSprite from './images/next.svg?react';
import NoSprite from './images/no.svg?react';
import RetrySprite from './images/retry.svg?react';
import YesSprite from './images/yes.svg?react';
import styles from './index.module.scss';
import { Props } from './types';

export const Button = (props: Props) => {
  const { type, model, ...otherProps } = props;
  const color = type === 'retry' || type === 'next' ? 'orange' : 'white';

  return (
    <BaseButton
      {...otherProps}
      classNames={{ main: styles.button, content: styles.content }}
      color={color}
      disabled={model.clicker.disabled}
      onClick={model.clicker.click}
    >
      {type === 'next' && <NextSprite />}
      {type === 'retry' && <RetrySprite />}
      {type === 'yes' && <YesSprite />}
      {type === 'no' && <NoSprite />}
    </BaseButton>
  );
};
