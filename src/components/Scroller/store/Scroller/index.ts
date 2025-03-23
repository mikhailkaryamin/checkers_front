import { AnimeParams } from 'animejs';
import { defaults } from 'lodash';
import { action, makeObservable, observable } from 'mobx';
import { Anime } from 'src/shared/classes/Anime';
import { EventEmitter } from 'src/shared/classes/EventEmitter';
import { Events } from 'src/shared/classes/Events';
import { getPointByRelativeElement } from 'src/shared/helpers/getPointByRelativeElement';
import { Nullable, Point } from 'src/types';
import { animeEasings, eventNames } from './constants';
import { EventTypeMap, Options } from './types';

export class Scroller {
  public readonly eventNames = eventNames;

  public readonly events: Events<EventTypeMap>;

  @observable
  protected _element: Nullable<HTMLDivElement> = null;

  @observable
  protected _autoScrollingEnabled!: boolean;

  @observable
  protected _step = 50;

  protected _anime: Anime<Point>;

  protected _eventEmitter = new EventEmitter<EventTypeMap>();

  public constructor(options?: Options) {
    makeObservable(this);
    this._anime = new Anime({ x: options?.x ?? 0, y: options?.y ?? 0 });
    this.events = new Events({ eventEmitter: this._eventEmitter });
    this.setAutoScrollingEnabled(options?.autoScrollingEnabled ?? true);
    this._step = options?.step ?? this._step;
  }

  public get element() {
    return this._element;
  }

  public get autoScrollingEnabled() {
    return this._autoScrollingEnabled;
  }

  public get step() {
    return this._step;
  }

  public get maxHorizontalScroll() {
    if (this.element === null) {
      throw new Error('element not provided');
    }

    return this.element.scrollWidth - this.element.offsetWidth;
  }

  public get maxVerticalScroll() {
    if (this.element === null) {
      throw new Error('element not provided');
    }

    return this.element.scrollHeight - this.element.offsetHeight;
  }

  public get horizontalPercentage() {
    return (this._anime.current.x / this.maxHorizontalScroll) * 100;
  }

  public get verticalPercentage() {
    return (this._anime.current.y / this.maxVerticalScroll) * 100;
  }

  public get scrollPoint() {
    return this._anime.current;
  }

  @action.bound
  public setElement(element: Nullable<HTMLDivElement>) {
    if (this.element === element) return;

    if (element) {
      element.addEventListener('scroll', this._handleScroll);
    } else {
      this.element?.removeEventListener('scroll', this._handleScroll);
    }

    this._element = element;
    this._eventEmitter.emit('refChange');
  }

  @action.bound
  public setAutoScrollingEnabled(autoScrollingEnabled: boolean) {
    this._autoScrollingEnabled = autoScrollingEnabled;
  }

  @action.bound
  public setStep(step: number) {
    this._step = step;
  }

  @action.bound
  public async scrollTo(point: Point, options?: AnimeParams) {
    if (this.element === null) return;

    const sanitizedPoint = this._sanitizePoint(point);

    const sanitizedOptions = defaults(options, {
      duration: 500,
      easing: animeEasings.easeInOutQuad,
    });

    await this._anime.animate({
      ...sanitizedPoint,
      ...sanitizedOptions,
      update: () => {
        this.element?.scrollTo(this._anime.current.x, this._anime.current.y);
      },
    });
  }

  @action.bound
  public scrollToInstantly(point: Point) {
    const sanitizedPoint = this._sanitizePoint(point);
    this._anime.setCurrent(sanitizedPoint);
    this.element?.scrollTo(sanitizedPoint.x, sanitizedPoint.y);
  }

  @action.bound
  public async scrollX(x: number, options?: AnimeParams) {
    await this.scrollTo({ x, y: this._anime.current.y }, options);
  }

  @action.bound
  public async scrollY(y: number, options?: AnimeParams) {
    await this.scrollTo({ x: this._anime.current.x, y }, options);
  }

  @action.bound
  public scrollXInstantly(x: number) {
    this.scrollToInstantly({ x, y: this._anime.current.y });
  }

  @action.bound
  public scrollYInstantly(y: number) {
    this.scrollToInstantly({ x: this._anime.current.x, y });
  }

  @action.bound
  public async scrollToElement(targetElement: HTMLElement, options?: AnimeParams) {
    if (this.element === null) return;

    const centerPoint = this._sanitizePoint(this._getElementCenterPoint(targetElement));
    await this.scrollTo(centerPoint, options);
  }

  @action.bound
  public scrollToElementInstantly(targetElement: HTMLElement) {
    const centerPoint = this._sanitizePoint(this._getElementCenterPoint(targetElement));
    this._anime.setCurrent(centerPoint);
    this.element?.scrollTo(centerPoint.x, centerPoint.y);
  }

  @action.bound
  public clear() {
    this._anime.stop();
    this.element?.removeEventListener('scroll', this._handleScroll);
  }

  protected _sanitizePoint(point: Point) {
    if (this.element === null) return point;

    const sanitizedPoint = {
      x: Math.min(Math.max(0, point.x), this.maxHorizontalScroll),
      y: Math.min(Math.max(0, point.y), this.maxVerticalScroll),
    };

    return sanitizedPoint;
  }

  protected _getElementCenterPoint(targetElement: HTMLElement) {
    if (this.element === null) return { x: 0, y: 0 };

    const point = getPointByRelativeElement(targetElement, this.element);
    const padding = 20;
    const elementWidth = this.element.offsetWidth - padding;
    const elementHeight = this.element.offsetHeight - padding;
    const centerX =
      point.x + this.element.scrollLeft - elementWidth / 2 + targetElement.offsetWidth / 2;
    const centerY =
      point.y + this.element.scrollTop - elementHeight / 2 + targetElement.offsetHeight / 2;

    return { x: centerX, y: centerY };
  }

  @action.bound
  protected _handleScroll() {
    this._updateAnime();
    this._eventEmitter.emit('scroll');
  }

  protected _updateAnime() {
    if (!this.element) return;

    this._anime.setCurrent({
      x: this.element.scrollLeft,
      y: this.element.scrollTop,
    });
  }
}
