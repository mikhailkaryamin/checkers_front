import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Board } from 'src/components/Board';
import { useEffectOnMount } from 'src/shared/hooks/useEffectOnMount';
import { rootStore } from 'src/store/RootStore';
import { Piece } from './components/Piece';
import styles from './index.module.scss';
import { Props } from './types';

export const Chess = observer(function Chess(props: Props) {
  const { className, children, ...otherProps } = props;

  useEffectOnMount(() => () => model.clear());
  const { battleStore: { chess: model } } = rootStore;

  return (
    <Board {...otherProps} className={cn(styles.main, className)}>
      <div className={styles.initialPiecesContainer}>
        {model.pieces.all.map((piece) => {
            return (
              <Piece
                key={piece.id}
                model={piece}
                absolute
                fullSize
              />
            );
        })}
      </div>
      {children}
    </Board>
  );
});
