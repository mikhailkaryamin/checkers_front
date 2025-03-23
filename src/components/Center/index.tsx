import styles from './index.module.scss';
import { Props } from './types';

export const Center = ({ children }: Props) => <div className={styles.main}>{children}</div>;
