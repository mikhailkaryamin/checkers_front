import { makeAutoObservable } from "mobx";
import { Board } from "src/components/Board/store/Board";
import { GameStore } from "./GameStore";
// import { UIStore } from "../UIStore";

export class RootStore {
  gameStore: GameStore;
  boardStore: Board;
  // uiStore: UIStore;

  constructor() {
    this.gameStore = new GameStore(this);
    this.boardStore = new Board();
    // this.uiStore = new UIStore(this);

    makeAutoObservable(this);
  }
}
// Инстанст рутового стора, чтобы импортировать откуда угодно
export const rootStore = new RootStore();
