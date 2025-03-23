import { observer } from 'mobx-react-lite';
import { Center } from 'src/components/Center';
import { Fade } from 'src/components/Fade';
import { Bubble } from './components/Bubble';
import { Buttons } from './components/Buttons';
import styles from './index.module.scss';
import { Props } from './types';

export const Popup = observer(function Popup(props: Props) {
  const { model } = props;
  return (
    <Fade className={styles.main} model={model.fade} absolute fullSize>
      <Center>
        <div className={styles.innerWrap}>
          {model.bubbleType && (
            <Bubble
              bubbleType={model.bubbleType}
              playerSide={model.playerSide}
            />
          )}
          <Buttons model={model.buttons} />
        </div>
      </Center>
    </Fade>
  );
});
