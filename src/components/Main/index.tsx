import { observer } from "mobx-react-lite";
import { rootStore } from 'src/store/RootStore';
import { BackgroundImage } from "../BackgroundImage";
import { Fade } from "../Fade";
import { Logo } from "../Logo";
import backgroundSource from './images/background.svg';
import styles from './index.module.scss';

export const Main = observer(function Main() {
  const { mainStore: model } = rootStore;
  return <Fade model={model.fade} className={styles.main} fullSize>
    <BackgroundImage src={backgroundSource}/>
    <Logo classnames={{ logo: styles.logo, checker: styles.checker }} />
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
