import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Block } from 'src/components/Block';
import { Fade } from 'src/components/Fade';
import styles from '../../index.module.scss';
import { Slot } from '../Slot';
import { defaultAnimationDuration } from './constants';
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
      <Fade
        className={styles.dot}
        shown={cell.selectionType === 'dot'}
        duration={cell.selectionTypeAnimation.animating ? defaultAnimationDuration : 0}
        hasUnmount
        onFadeEnd={cell.selectionTypeAnimation.finish}
      />
      <Fade
        className={cn(styles.overlap, styles[`overlap_color_${cell.color}`])}
        shown={cell.selectionType === 'overlap'}
        duration={cell.selectionTypeAnimation.animating ? defaultAnimationDuration : 0}
        absolute
        fullSize
        hasUnmount
        onFadeEnd={cell.selectionTypeAnimation.finish}
      />
      <Slot className={styles.slot} model={cell.slot} data-test-id={`cell-${cell.square}-slot`} />
    </div>
  );
});
