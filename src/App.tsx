import React from "react";
import { Battle } from "./components/Battle";
import { Main } from "./components/Main";
import { Preloader } from "./components/Preloader";
import { RotateScreen } from "./components/RotateScreen";
import { Statistics } from "./components/Statistics";
import { TheoryBook } from "./components/TheoryBook";
import styles from './styles/app.module.scss';

const App: React.FC = () => {
  return (
    <div className={styles.main}>
      {/* TODO: rotate screen */}
      <Main />
      <Battle />
      <TheoryBook />
      <Statistics />
      <Preloader />
      <RotateScreen />
    </div>
  );
};

export default App;
