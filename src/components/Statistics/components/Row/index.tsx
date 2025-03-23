import { MatchResult as Result } from "src/types";
import styles from "../../index.module.scss";
import { Props } from "./types";

export const Row = ({date, result}: Props) => {
  return  <div className={styles.row}>
    <div className={styles.rowItem}>
      { date }
    </div>
    <div className={styles.rowItem}>
      {result === Result.Loss && <>Проиграл ❌</>}
      {result === Result.Win && <>Выйграл ✅</>}
      {result === Result.Draw && <>Ничья 🤝</>}
    </div>
  </div>
}
