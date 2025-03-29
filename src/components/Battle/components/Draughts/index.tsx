import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Draughts as BaseChess } from 'src/components/Draughts';
import styles from './index.module.scss';
import { Props } from './types';

export const Draughts = observer(function Draughts({model}: Props) {
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
