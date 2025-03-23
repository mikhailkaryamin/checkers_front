import { action, makeObservable, observable } from "mobx";
import { Fade } from "src/components/Fade/store/Fade";
import { Scroller } from "src/components/Scroller/store/Scroller";
import { Clicker } from "src/shared/classes/Clicker";
import { StorageStore } from "src/store/StorageStore";
import { Options } from "./types";

export class Statistics {
  public fade = new Fade({ shown: false, hasUnmount: true });

  public scroller = new Scroller();

  public backButton = new Clicker();

  protected _storage: StorageStore;

  @observable
  protected _scrollbar = {
    y: 0,
    height: 0,
  };

  public constructor({ storage }: Options) {
    makeObservable(this);

    this._storage = storage;

    this.scroller.events.on('refChange', () => this._handleScrollerRefChange());
    this.scroller.events.on('scroll', () => this._handleScrollerScroll());
  }

  public get scrollbar() {
    return this._scrollbar;
  }

  public get formattedResults() {
    const rawResults = this._storage.matchResults;

    return rawResults.map((r) => {
      const date = new Date(r.date);

      return {
        date: date.toLocaleDateString("ru-RU"),
        result: r.result
      }
    })
  }

  protected _handleScrollerRefChange() {
    this._updateScrollbar();
  }

  protected _handleScrollerScroll() {
    this._updateScrollbar();
  }

  @action.bound
  protected _updateScrollbar() {
    const element = this.scroller.element;
    if (!element) return;
    const elementHeight =
      element.offsetHeight - parseFloat(getComputedStyle(element).paddingBottom);
    const ratio = elementHeight / element.scrollHeight;
    this._scrollbar = {
      y: this.scroller.scrollPoint.y * ratio,
      height: elementHeight * ratio,
    };
  }
}
