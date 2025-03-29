import { action, makeObservable, observable } from 'mobx';
import { Deferred } from 'src/shared/classes/Deferred';
import { Timeout } from 'src/shared/classes/Timeout';
import { Nullable } from 'src/types';
import { DraughtsSkinType } from '../../types';
import { AnimatableValue } from '../AnimatableValue';
import { ExtraTimer } from './ExtraTimer';
import { Data, Options, PositionValue } from './types';

export class Timer {
  public readonly position = new AnimatableValue<PositionValue>('outside');

  public readonly extraTimer = new ExtraTimer({ isShown: true, value: 5000 });

  @observable
  protected _skinType: DraughtsSkinType = DraughtsSkinType.Default;

  @observable
  protected _value: number;

  protected _initialData: Nullable<Data>;

  protected readonly _timeout = new Timeout({
    duration: 1000,
    callback: () => this._handleTimeoutTick(),
  });

  protected _deferredRunning: Nullable<Deferred<void>> = null;

  public constructor(options?: Options) {
    makeObservable(this);
    this._initialData = options?.data ?? null;
    this._value = this._initialData?.mainTime ?? 0;
  }

  public get isConfigured() {
    return !!this.initialData;
  }

  public get initialData() {
    return this._initialData;
  }

  public get skinType() {
    return this._skinType;
  }

  public get value() {
    return this._value;
  }

  public get minutes() {
    return Math.floor((this.value / 1000 / 60) % 60);
  }

  public get seconds() {
    return Math.floor((this.value / 1000) % 60);
  }

  public get time() {
    const minutes = this.minutes.toString().padStart(2, '0');
    const seconds = this.seconds.toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  public get isLaunched() {
    return this._timeout.isLaunched;
  }

  public async run() {
    this._deferredRunning = new Deferred();
    while (!this.checkIfTimeOut()) {
      await this._timeout.run();
    }
    this._deferredRunning.resolve();
    this._deferredRunning = null;
  }

  public pause() {
    if (this._timeout.isPaused) return;
    this._timeout.pause();
  }

  public reset() {
    if (this.initialData) {
      this.setData(this.initialData);
    }
  }

  public resume() {
    if (!this._timeout.isPaused) return;
    this.extraTimer.update(this._initialData?.extraTime ?? 0);
    this._timeout.resume();
  }

  public cancel() {
    this._timeout.cancel();
    this._deferredRunning = null;
  }

  public checkIfTimeOut() {
    return this.isConfigured && this.value === 0 && this.extraTimer.value === 0;
  }

  @action.bound
  public setSkinType(skinType: DraughtsSkinType) {
    this._skinType = skinType;
  }

  public async waitWhenRunning() {
    await this._deferredRunning?.promise;
  }

  @action.bound
  public setData(data: Nullable<Data>) {
    this._initialData = data;
    this._value = this._initialData?.mainTime ?? 0;
    this.extraTimer.update(this._initialData?.extraTime ?? 0);
  }

  @action.bound
  protected _handleTimeoutTick() {
    if (this.extraTimer.value !== 0) {
      this.extraTimer.update(this.extraTimer.value - 1000);
    } else if (this._value !== 0) {
      this._value = this._value - 1000;
    }
  }
}
