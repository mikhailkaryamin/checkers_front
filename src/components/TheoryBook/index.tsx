import cn from 'classnames';
import { observer } from "mobx-react-lite";
import { rootStore } from 'src/store/RootStore';
import { BackButton } from '../BackButton';
import { Button } from "../Button";
import { Fade } from "../Fade";
import { IconButton } from "../IconButton";
import { Image } from "../Image";
import { Text } from "../Text";
import styles from './index.module.scss';

export const TheoryBook = observer(function TheoryBook() {
  const { theoryBookStore: model } = rootStore;

  return (
    <Fade model={model.fade} className={styles.main} absolute fullSize>
      <BackButton onClick={model.backButton.click}/>
      <div className={styles.container}>
        <Button
          className={cn(styles.button, styles.prevButton)}
          color="orange"
          hasPadding={false}
          disabled={model.prevButton.disabled}
          onClick={model.prevButton.click}
        >
          <IconButton type="back" className={styles.prevButtonIcon} />
        </Button>
        <Fade model={model.contentFade}>
          <div className={styles.imageContainer}>
            <Image className={styles.image} src={model.currentPage.image} fullSize />
          </div>
          <div className={styles.description}>
            <Text value={model.currentPage.text} />
          </div>
        </Fade>
        <Button
          className={cn(styles.button, styles.nextButton)}
          color="orange"
          hasPadding={false}
          disabled={model.nextButton.disabled}
          onClick={model.nextButton.click}
        >
          <IconButton type="forward" />
        </Button>
      </div>
    </Fade>
  )
})
