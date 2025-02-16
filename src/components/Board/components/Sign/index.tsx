import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Fade } from 'src/components/Fade';
import styles from '../../index.module.scss';
import { Props } from './types';

export const Sign = observer(function Sign(props: Props) {
  const { model: sign, isOppositeSide } = props;

  return (
    <Fade
      className={cn(
        styles.sign,
        styles[`sign_direction_${sign.direction}`],
        styles[`sign_index_${sign.index}`],
        isOppositeSide && styles.sign_oppositeSide,
      )}
      model={sign.fade}
      isUsingRef={!isOppositeSide}
    >
      <Fade className={styles.signContent} model={sign.valueFade} isUsingRef={!isOppositeSide}>
        {sign.value}
      </Fade>
    </Fade>
  );
});
