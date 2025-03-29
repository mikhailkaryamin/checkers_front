import cn from "classnames";
import { observer } from "mobx-react-lite";
import { rootStore } from "src/store/RootStore";
import { BackButton } from "../BackButton";
import { Fade } from "../Fade";
import { Scroller } from "../Scroller";
import { Row } from "./components/Row";
import styles from "./index.module.scss";

export const Statistics = observer(function Statistics() {
  const { statistiscsStore: model } = rootStore;

  return (<Fade model={model.fade} className={styles.main} absolute fullSize data-testid="statistics">
    <BackButton onClick={model.backButton.click}/>
    <div
      className={cn(
        styles.scrollerContainer
      )}
    >
      <div className={styles.scrollerHeader}>
        <div className={styles.scrollerHeaderItem}>
          Дата
        </div>
        <div className={styles.scrollerHeaderItem}>
          Результат
        </div>
      </div>
      <Scroller className={styles.scroller} model={model.scroller}>
        {model.formattedResults.map((r, i) => <Row key={i} date={r.date} result={r.result} />)}
      </Scroller>
      <div
        style={{
          height: model.scrollbar.height,
          transform: `translateY(${model.scrollbar.y}px)`,
        }}
        className={styles.scrollbar}
      />
    </div>
  </Fade>)
})
