import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import styles from '../../index.module.scss';
import { Props } from './types';

export const SkinButton = observer(function SkinButton(props: Props) {
  const { className, model, ...otherProps } = props;

  return (
    <div
      {...otherProps}
      ref={model.ref.setCurrent}
      className={cn(
        styles.skinButton,
        model.clicker.enabled && styles.skinButton_isEnabled,
        model.isSelected && styles.skinButton_isSelected,
        model.isActive && styles.skinButton_isActive,
        className,
      )}
      onClick={model.clicker.click}
    >
      <div className={cn(
        styles.skin,
        styles[`skin_${model.skinType}`],
      )} />
    </div>
  );
});
