import { action, makeObservable, observable } from 'mobx';
import { Animation } from 'src/shared/classes/Animation';
import { EventEmitter } from 'src/shared/classes/EventEmitter';
import { Events } from 'src/shared/classes/Events';
import { Ref } from 'src/shared/classes/Ref';
import { eventNames } from './constants';
import { EventTypeMap, HideParams, Options, ShowParams, ToggleParams } from './types';

export class Fade extends Animation {
  public readonly events: Events<EventTypeMap>;

  public readonly ref = new Ref();

  @observable
  protected _shown = true;

  @observable
  protected _duration = 500;

  @observable
  protected _delay = 0;

  @observable
  protected _easing = 'ease-in-out';

  @observable
  protected _hasUnmount = false;

  @observable
  protected _isMounted: boolean;

  protected eventEmitter = new EventEmitter<EventTypeMap>();

  protected _togglingValue = false;

  public constructor(options?: Options) {
    super();
    makeObservable(this);
    this.events = new Events({ eventEmitter: this.eventEmitter });
    this._shown = options?.shown ?? this._shown;
    this._hasUnmount = options?.hasUnmount ?? this._hasUnmount;
    this._isMounted = this._hasUnmount ? this.shown : true;
    this._duration = options?.duration ?? this._duration;
    this._delay = options?.delay ?? this._delay;
    this._easing = options?.easing ?? this._easing;
    this._togglingValue = this.shown;
  }

  public get shown() {
    return this._shown;
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

  public get hasUnmount() {
    return this._hasUnmount;
  }

  public get hiddenStatic() {
    return !this.animating && !this.shown;
  }

  public get isMounted() {
    return this._isMounted;
  }

  @action.bound
  public async show(params?: ShowParams) {
    await this.toggle({ ...params, shown: true });
  }

  @action.bound
  public async hide(params?: HideParams) {
    await this.toggle({ ...params, shown: false });
  }

  @action.bound
  public async toggle(params?: ToggleParams) {
    const shown = params?.shown ?? !this.shown;
    const duration = params?.duration ?? this.duration;
    const delay = params?.delay ?? this.delay;
    const easing = params?.easing ?? this.easing;

    if (shown === this._togglingValue) return;

    this._togglingValue = shown;

    if (duration === 0) {
      this.start();
      this.eventEmitter.emit(eventNames.changed, { shown });
      this.setIsMounted(!this.hasUnmount || shown);
      this._setShown(shown);
      this.finish();
      return;
    }

    this.start();
    this.eventEmitter.emit(eventNames.changed, { shown });
    this.setDuration(duration);
    this.setDelay(delay);
    this.setEasing(easing);
    this.setIsMounted(true);
    await this.ref.waitWhenSetWithReflow();
    this._setShown(shown);
    await this.waitWhenAnimating();

    if (this.hasUnmount && !this._togglingValue) {
      this.setIsMounted(false);
    }
  }

  public finish() {
    super.finish();
    this.eventEmitter.emit(eventNames.fadeEnd, { shown: this.shown });
  }

  @action.bound
  public async toggleInstantly(shown = !this.shown) {
    const prevDuration = this.duration;
    await this.toggle({ shown, duration: 0 });
    this.setDuration(prevDuration);
  }

  @action.bound
  public async showInstantly() {
    await this.toggleInstantly(true);
  }

  @action.bound
  public async hideInstantly() {
    await this.toggleInstantly(false);
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
  public setHasUnmount(hasUnmount: boolean) {
    this._hasUnmount = hasUnmount;
  }

  @action.bound
  public setIsMounted(mounted: boolean) {
    this._isMounted = mounted;

    if (mounted) {
      this.ref.setCurrent(null);
    }
  }

  @action.bound
  protected _setShown(shown: boolean) {
    this._shown = shown;
  }
}
