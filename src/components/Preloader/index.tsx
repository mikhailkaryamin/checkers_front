import { rootStore } from "src/store/RootStore";
import { Fade } from "../Fade";
import styles from "./index.module.scss";

export const Preloader = () => {
  const { preloaderStore: model } = rootStore;

  return (
    <Fade model={model.fade} className={styles.main} absolute fullSize>
      <div className={styles.logo}>
        <svg className={styles.checker} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" />
        </svg>
        ШАШКИ
      </div>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} onAnimationEnd={model.handleLoadingEnd} />
      </div>
    </Fade>
  )
}
