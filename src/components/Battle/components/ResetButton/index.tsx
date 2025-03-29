import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Button } from 'src/components/Button';
import { Fade } from 'src/components/Fade';
import { Icon } from 'src/components/Icon';
import styles from './index.module.scss';
import { Props } from './types';

export const ResetButton = observer(function ResetButton(props: Props) {
  const { model } = props;
  const color = model.clicker.disabled ? 'purple' : 'white';

  return (
    <Fade className={cn(styles.main, styles[`main_color_${color}`])} model={model.fade}>
      <Button
        color={color}
        disabled={model.clicker.disabled}
        hasPadding={false}
        onClick={model.clicker.click}
        data-testid="reset_button"
      >
        <Icon type="repeat" />
      </Button>
    </Fade>
  );
});
