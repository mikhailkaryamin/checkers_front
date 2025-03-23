import { action, makeObservable } from "mobx";
import { Fade } from "src/components/Fade/store/Fade";

export class Preloader {
  public fade = new Fade({ hasUnmount: true })

  public constructor() {
    makeObservable(this);
  }

  @action.bound
  public handleLoadingEnd() {
    this.fade.hide();
  }
}
