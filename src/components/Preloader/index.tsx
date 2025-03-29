import { rootStore } from "src/store/RootStore";
import { Fade } from "../Fade";
import { Logo } from "../Logo";
import styles from "./index.module.scss";

export const Preloader = () => {
  const { preloaderStore: model } = rootStore;

  return (
    <Fade model={model.fade} className={styles.main} absolute fullSize data-testid="progress_bar">
      <Logo />
      <div className={styles.progressContainer}>
        <div className={styles.progressBar} onAnimationEnd={model.handleLoadingEnd} />
      </div>
    </Fade>
  )
}
