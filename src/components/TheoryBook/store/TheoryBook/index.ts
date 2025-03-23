import { action, makeAutoObservable } from "mobx";
import { Fade } from "src/components/Fade/store/Fade";
import { Clicker } from "src/shared/classes/Clicker";
import { bookData } from './constants';

export class TheoryBook {
  public nextButton = new Clicker();

  public prevButton = new Clicker();

  public backButton = new Clicker();

  public contentFade = new Fade();

  public fade = new Fade({ shown: false, hasUnmount: true })

  protected _currentPageIndex = 0;

  protected _bookData = bookData;

  constructor() {
    makeAutoObservable(this);
    this._initButtons();

    this.nextButton.events.on('click', () => {
      this._nextButtonHandler()
    })

    this.prevButton.events.on('click', () => {
      this._prevButtonHandler()
    })
  }

  public get currentPage() {
    return bookData[this._currentPageIndex];
  }

  protected _initButtons() {
    this.prevButton.disable();

    if (this._bookData.length === 1) {
      this.nextButton.disable();
    }
  }

  @action.bound
  protected async _nextButtonHandler() {
    await this.contentFade.hide();
    this._currentPageIndex++;

    if (this._currentPageIndex === this._bookData.length - 1) {
      this.nextButton.disable();
    }

    if (this._currentPageIndex > 0) this.prevButton.enable();

    await this.contentFade.show();
  }

  @action.bound
  protected async _prevButtonHandler() {
    await this.contentFade.hide();
    this._currentPageIndex--;

    if (this._currentPageIndex === 0) this.prevButton.disable();
    if (this._currentPageIndex < this._bookData.length - 1) this.nextButton.enable();

    await this.contentFade.show();
  }
}
