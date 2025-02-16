import { action, makeObservable, observable } from 'mobx';
import { Anime } from 'src/shared/classes/Anime';
import { Deferred } from 'src/shared/classes/Deferred';
import { EventEmitter } from 'src/shared/classes/EventEmitter';
import { Events } from 'src/shared/classes/Events';
import { getElementSize } from 'src/shared/helpers/getElementSize';
import { getPointByRelativeElement } from 'src/shared/helpers/getPointByRelativeElement';
import { Nullable, Point } from 'src/types';
import { defaultPointHelper, defaultTrajectoryHelper, eventNames } from './constants';
import { EventTypeMap, Options, PointHelper, TrajectoryHelper } from './types';

export class AnimatedReparentable extends Anime<Point> {
  public readonly events: Events<EventTypeMap>;

  protected eventEmitter = new EventEmitter<EventTypeMap>();

  protected _element: Nullable<HTMLElement> = null;

  @observable
  protected _anchor: Nullable<HTMLElement> = null;

  protected _parent: Nullable<HTMLElement> = null;

  protected _duration = 500;

  protected _delay = 0;

  protected _easing = 'easeInOutQuad';

  protected _trajectoryHelper = defaultTrajectoryHelper;

  protected _pointHelper = defaultPointHelper;

  protected _deferredElementSet = new Deferred<void>();

  public constructor(options?: Options) {
    super({ x: 0, y: 0 });
    makeObservable(this);
    this.events = new Events({ eventEmitter: this.eventEmitter });
    this._anchor = options?.anchor ?? this._anchor;
    this._duration = options?.duration ?? this._duration;
    this._delay = options?.delay ?? this._delay;
    this._easing = options?.easing ?? this._easing;
    this._trajectoryHelper = options?.trajectoryHelper ?? this._trajectoryHelper;
    this._pointHelper = options?.pointHelper ?? this._pointHelper;
  }

  public get element() {
    return this._element;
  }

  public get anchor() {
    return this._anchor;
  }

  public get parent() {
    return this._parent;
  }

  public get duration() {
    return this._duration;
  }

  public get delay() {
    return this._delay;
  }

  public get easing() {
    return this._easing;
  }

  public get point() {
    return this._current;
  }

  @action.bound
  public loadElement(element: HTMLElement) {
    this._element = element;
    this._deferredElementSet.resolve();
    this._parent = element.parentElement;

    if (this.anchor) {
      this.setCurrent(
        this._pointHelper({
          elementSize: getElementSize(element),
          anchorSize: getElementSize(this.anchor),
        }),
      );
    }
  }

  @action.bound
  public async moveTo(anchor: HTMLElement) {
    if (this.element === null) return;

    const startPoint = getPointByRelativeElement(this.element, anchor);
    const finishPoint = this._pointHelper({
      elementSize: getElementSize(this.element),
      anchorSize: getElementSize(anchor),
    });

    this.setAnchor(anchor);
    this.setCurrent(startPoint);
    this._initElementPositionByPointIfNeed();

    await this.animate({
      ...finishPoint,
      duration: this.duration,
      easing: this.easing,
      delay: this.delay,
      update: () => {
        this.setCurrent(
          this._trajectoryHelper({ startPoint, currentPoint: this.point, finishPoint }),
        );
      },
    });
  }

  @action.bound
  public moveToInstantly(anchor: HTMLElement) {
    if (this.element === null) return;

    this.setAnchor(anchor);
    this.setCurrent(
      this._pointHelper({
        elementSize: getElementSize(this.element),
        anchorSize: getElementSize(anchor),
      }),
    );
  }

  @action.bound
  public setDuration(duration: number) {
    this._duration = duration;
  }

  @action.bound
  public setDelay(delay: number) {
    this._delay = delay;
  }

  @action.bound
  public setEasing(easing: string) {
    this._easing = easing;
  }

  @action.bound
  public setTrajectoryHelper(trajectoryHelper: Nullable<TrajectoryHelper>) {
    this._trajectoryHelper = trajectoryHelper || defaultTrajectoryHelper;
  }

  @action.bound
  public setPointHelper(pointHelper: Nullable<PointHelper>) {
    this._pointHelper = pointHelper || defaultPointHelper;
  }

  @action.bound
  public setAnchor(anchor: Nullable<HTMLElement>) {
    this._anchor = anchor;

    if (this.element && anchor) {
      anchor.append(this.element);
    } else if (this.element) {
      this._parent?.append(this.element);
    }

    this.eventEmitter.emit(eventNames.anchorChange, { anchor });
  }

  @action.bound
  public prepareToUnmount() {
    this.setAnchor(this.parent);
  }

  public async waitWhenElementSet() {
    await this._deferredElementSet.promise;
  }

  protected _initElementPositionByPointIfNeed() {
    if (this._element) {
      this._element.style.transform = `translate(${this.current.x}px, ${this.current.y}px)`;
    }
  }
}
