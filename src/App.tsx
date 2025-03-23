import React from "react";
import { Battle } from "./components/Battle";
import { Interface } from "./components/Interface";
import { Main } from "./components/Main";
import { Preloader } from "./components/Preloader";
import { RotateScreen } from "./components/RotateScreen";
import { Statistics } from "./components/Statistics";
import { TheoryBook } from "./components/TheoryBook";
import styles from './styles/app.module.scss';

const App: React.FC = () => {
  return (
    <div className={styles.main}>
      <Main />
      <Battle />
      <TheoryBook />
      <Statistics />
      <Interface />
      <Preloader />
      <RotateScreen />
    </div>
  );
};

export default App;
