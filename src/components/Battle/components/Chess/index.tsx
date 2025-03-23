import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Chess as BaseChess } from 'src/components/Chess';
import styles from './index.module.scss';
import { Props } from './types';

export const Chess = observer(function Chess({model}: Props) {
  return (
    <BaseChess
      className={cn(
        styles.main,
        model.position.animation.animating && styles.main_isTransitioning,
        styles[`main_position_${model.position.value}`],
      )}
      onTransitionEnd={model.position.animation.finish}
    />
  );
});
