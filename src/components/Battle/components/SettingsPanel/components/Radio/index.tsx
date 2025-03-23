import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import styles from '../../index.module.scss';
import { Props } from './types';

export const Radio = observer(function Radio(props: Props) {
  const { model } = props;

  return (
    <div
      className={cn(styles.radio, model.clicker.enabled && styles.radio_isEnabled)}
      onClick={model.clicker.click}
    >
      <div className={cn(styles.radioCircle, model.isSelected && styles.radioCircle_isFilled)} />
      {model.content}
    </div>
  );
});
