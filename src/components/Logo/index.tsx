import cn from "classnames";
import styles from "./index.module.scss";
import { Props } from "./types";

export const Logo = ({classnames}: Props) => {
  return (
    <div className={cn(styles.logo, classnames?.logo)} data-testid="logo">
      <svg className={cn(styles.checker, classnames?.checker)} viewBox="0 0 100 100"  data-testid="svg-logo">
        <circle cx="50" cy="50" r="40" />
      </svg>
      ШАШКИ
    </div>
  )
}
