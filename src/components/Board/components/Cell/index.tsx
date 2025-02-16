import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Block } from 'src/components/Block';
import styles from '../../index.module.scss';
import { Slot } from '../Slot';
import { Props } from './types';

export const Cell = observer(function Cell(props: Props) {
  const { model: cell } = props;

  return (
    <div
      className={cn(
        styles.cell,
        styles[`cell_color_${cell.color}`],
        cell.selectionType && styles[`cell_selectionType_${cell.selectionType}`],
        cell.hoverable && styles.cell_hoverable,
        cell.hovered && styles.cell_hovered,
        cell.clicker.enabled && styles.cell_enabled,
      )}
      onClick={cell.clicker.click}
    >
      <Block className={cn(styles.hover, styles[`hover_color_${cell.color}`])} absolute fullSize />
      <Slot className={styles.slot} model={cell.slot} data-test-id={`cell-${cell.square}-slot`} />
    </div>
  );
});
