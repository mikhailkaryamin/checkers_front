import { observer } from "mobx-react-lite";
import { rootStore } from 'src/store/RootStore';
import { BackgroundImage } from "../BackgroundImage";
import { Fade } from "../Fade";
import backgroundSource from './images/background.svg';
import styles from './index.module.scss';

export const Main = observer(function Main() {
  const { mainStore: model } = rootStore;
  return <Fade model={model.fade} fullSize>
    <BackgroundImage src={backgroundSource}/>
    <div className={styles.buttonsContainer}>
      <div className={styles.button} onClick={model.play.clicker.click}>
        Играть
      </div>
      <div className={styles.button} onClick={model.theory.clicker.click}>
        Теория
      </div>
      <div className={styles.button} onClick={model.statistics.clicker.click}>
        Статистика
      </div>
    </div>
  </Fade>
})
