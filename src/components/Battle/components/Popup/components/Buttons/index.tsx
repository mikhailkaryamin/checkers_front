import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Block } from 'src/components/Block';
import { Button } from '../Button';
import styles from './index.module.scss';
import { Props } from './types';

export const Buttons = observer(function Buttons(props: Props) {
  const { model } = props;

  return (
    <Block className={cn(styles.main, styles[`main_type_${model.type}`])}>
      {model.type === 'next' && <Button model={model.next} type={'next'} />}
      {model.type === 'retry' && <Button model={model.retry} type="retry" />}
      {model.type === 'yesNo' && (
        <>
          <Button model={model.yes} type="yes" />
          <Button model={model.no} type="no" />
        </>
      )}
    </Block>
  );
});
