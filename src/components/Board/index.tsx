import cn from 'classnames';
import { observer } from "mobx-react-lite";
import { Fragment } from 'react';
import { Block } from 'src/components/Block';
import { rootStore } from 'src/store/RootStore';
import { Cell } from './components/Cell';
import { Sign } from './components/Sign';
import styles from './index.module.scss';

export const Board = observer(() => {
  const { boardStore: model } = rootStore;

  return (
    <div
      className={cn(
        styles.main,
        styles[`main_side_${model.side}`],
        styles[`main_skinType_${model.skinType}`],
      )}
    >
      <Block className={styles.background} absolute fullSize />
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
