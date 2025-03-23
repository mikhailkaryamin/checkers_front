import cn from 'classnames';
import { range } from 'lodash';
import { observer } from 'mobx-react-lite';
import StarSprite from './images/star.svg?react';
import styles from './index.module.scss';
import { Props } from './types';

export const Stars = observer(function Stars(props: Props) {
  const { bubbleType, scoreCount } = props;
  const isSingleStar = bubbleType === 'draw' || bubbleType === 'loss';
  return (
    <div className={cn(styles.starsWrap, isSingleStar && styles.starsWrap_single)}>
      {isSingleStar ? (
        <div className={cn(styles.star, styles.star_single)}>
          <StarSprite />
        </div>
      ) : (
        range(3).map((_, i) => {
          return (
            <div key={i} className={cn(styles.star)}>
              <StarSprite />
            </div>
          );
        })
      )}
      <div className={cn(styles.score, isSingleStar && styles.score_small)}>{scoreCount}</div>
    </div>
  );
});
