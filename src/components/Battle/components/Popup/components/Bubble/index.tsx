import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Block } from 'src/components/Block';
import { Text } from 'src/components/Text';
import { getBubbleOptions } from './helpers';
import styles from './index.module.scss';
import { Props } from './types';

export const Bubble = observer(function Bubble(props: Props) {
  const { bubbleType, playerSide } = props;
  const bubbleOptions = getBubbleOptions(bubbleType, playerSide);
  const ImageBubble = bubbleOptions.Image;

  return (
    <div className={cn(styles.bubble, styles[`bubble_type_${bubbleType}`])}>
      <Block absolute fullSize>
        <ImageBubble />
      </Block>
      <Block className={styles.bubbleContent} absolute fullSize>
        <Text value={bubbleOptions.text} />
      </Block>
    </div>
  );
});
