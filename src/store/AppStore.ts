import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";

export class AppStore {
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;

    this._initMainButtons();
    this._initBackButtons();
  }

  protected _initMainButtons() {
    this.rootStore.mainStore.play.clicker.events.on('click', async () => {
      await this.rootStore.battleStore.fade.show();
      await this.rootStore.battleStore.showOnSettings();
      this.rootStore.mainStore.fade.hideInstantly();
    })

    this.rootStore.mainStore.theory.clicker.events.on('click', async () => {
      await this.rootStore.theoryBookStore.fade.show();
      this.rootStore.mainStore.fade.hideInstantly();
    })

    this.rootStore.mainStore.statistics.clicker.events.on('click', async () => {
      await this.rootStore.statistiscsStore.fade.show();
      this.rootStore.mainStore.fade.hideInstantly();
    })
  }

  protected _initBackButtons() {
    this.rootStore.battleStore.backButton.events.on('click', async () => {
      this.rootStore.mainStore.fade.showInstantly()
      await this.rootStore.battleStore.fade.hide();
      this.rootStore.battleStore.cancel();
    })

    this.rootStore.theoryBookStore.backButton.events.on('click', async () => {
      this.rootStore.mainStore.fade.showInstantly()
      await this.rootStore.theoryBookStore.fade.hide();
    })

    this.rootStore.statistiscsStore.backButton.events.on('click', async () => {
      this.rootStore.mainStore.fade.showInstantly()
      await this.rootStore.statistiscsStore.fade.hide();
    })
  }
}
