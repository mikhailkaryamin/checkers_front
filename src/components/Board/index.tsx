import cn from 'classnames';
import { observer } from "mobx-react-lite";
import { Fragment } from 'react';
import { Block } from 'src/components/Block';
import { rootStore } from 'src/store/RootStore';
import { Cell } from './components/Cell';
import { Sign } from './components/Sign';
import styles from './index.module.scss';
import { Props } from './types';

export const Board = observer((props: Props) => {
  const { className, children,  ...otherProps  } = props;
  const { battleStore: {draughts: { board: model } } } = rootStore;

  return (
    <div
      {...otherProps}
      className={cn(
        styles.main,
        styles[`main_side_${model.side}`],
        styles[`main_skinType_${model.skinType}`],
        className,
      )}
    >
      <Block className={styles.background} absolute fullSize />
      {children}
      {model.signs.map((sign, i) => (
        <Fragment key={i}>
          <Sign model={sign} isOppositeSide={false} />
          <Sign model={sign} isOppositeSide={true} />
        </Fragment>
      ))}
      <div className={styles.cellsContainer}>
        {model.cells.map((cell, i) => (
          <Cell key={i} model={cell} />
        ))}
      </div>
    </div>
  )
})
