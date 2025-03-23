import { makeAutoObservable } from "mobx";
import { Battle } from 'src/components/Battle/store/Battle';
import { Main } from 'src/components/Main/store/Main';
import { Preloader } from "src/components/Preloader/store/Preloader";
import { Statistics } from "src/components/Statistics/store/Statistics";
import { TheoryBook } from "src/components/TheoryBook/store/TheoryBook";
import { AppStore } from './AppStore';
import { StorageStore } from "./StorageStore";

export class RootStore {
  battleStore: Battle;
  mainStore: Main;
  appStore: AppStore;
  theoryBookStore: TheoryBook;
  statistiscsStore: Statistics;
  storageStore: StorageStore;
  preloaderStore: Preloader;

  constructor() {
    this.storageStore = new StorageStore();
    this.battleStore = new Battle({ storage: this.storageStore });
    this.mainStore = new Main();
    this.theoryBookStore = new TheoryBook();
    this.statistiscsStore = new Statistics({ storage: this.storageStore });
    this.preloaderStore = new Preloader();

    this.appStore = new AppStore(this);
    makeAutoObservable(this);
  }
}

export const rootStore = new RootStore();
