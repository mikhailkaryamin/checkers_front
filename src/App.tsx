import React from "react";
import { Board } from "./components/Board";

const App: React.FC = () => {
  return (
    <div className="app">
      <h1>Checkers Game</h1>
      <Board />
    </div>
  );
};

export default App;
