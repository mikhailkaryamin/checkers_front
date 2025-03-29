import { observer } from 'mobx-react-lite';
import { IconButton } from 'src/components/IconButton';
import styles from './index.module.scss';
import { Props } from './types';

export const BackButton = observer(function BackButton({onClick}: Props) {
  return <IconButton
    className={styles.backButton}
    type="back"
    onClick={onClick}
    data-testid="back_button"
  />
})
