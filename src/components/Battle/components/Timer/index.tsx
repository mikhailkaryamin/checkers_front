import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Block } from 'src/components/Block';
import styles from './index.module.scss';
import { Props } from './types';

export const Timer = observer(function Timer(props: Props) {
  const { model } = props;

  return (
    <div
      className={cn(
        styles.main,
        styles[`main_position_${model.position.value}`],
        styles[`main_skinType_${model.skinType}`],
      )}
      onTransitionEnd={model.position.animation.finish}
    >
      <Block className={styles.background} fullSize />
      <Block className={styles.itemsContainer} absolute fullSize>
        <Block className={styles.item} flex={{ centered: true }} absolute fullSize>
          {model.time}
        </Block>
      </Block>
      <div className={cn(styles.extraTimer, model.extraTimer.isShown && styles.extraTimer_isShown)}>
        +{model.extraTimer.second}
      </div>
    </div>
  );
});
