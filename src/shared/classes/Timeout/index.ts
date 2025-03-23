import { Nullable } from 'src/types';
import { Deferred } from '../Deferred';
import { EventEmitter } from '../EventEmitter';
import { Events } from '../Events';
import { EventTypeMap } from './types';

export class Timeout {
  public readonly events: Events<EventTypeMap>;

  protected _eventEmitter = new EventEmitter<EventTypeMap>();

  protected _timeoutId: Nullable<number> = null;

  protected _callback: Nullable<VoidFunction> = null;

  protected _duration = 1000;

  protected _deferred: Nullable<Deferred<void>> = null;

  protected _isPaused = false;

  public constructor(options?: { callback?: VoidFunction; duration?: number }) {
    this.events = new Events({ eventEmitter: this._eventEmitter });
    this._callback = options?.callback ?? this._callback;
    this._duration = options?.duration ?? this._duration;
    this._handleTimeout = this._handleTimeout.bind(this);
  }

  public get isLaunched() {
    return !!this._deferred;
  }

  public get isPaused() {
    return this._isPaused;
  }

  public start(options?: { callback?: VoidFunction; duration?: number }) {
    this.cancel();
    this._callback = options?.callback ?? this._callback;
    this._duration = options?.duration ?? this._duration;
    if (!this._callback) throw new Error('callback is required');
    this._deferred = new Deferred();
    this._setTimeout();
  }

  public cancel() {
    this._deferred = null;
    this._clearTimeout();
  }

  public async waitWhenRunning() {
    await this._deferred?.promise;
  }

  public async run() {
    this.start();
    await this.waitWhenRunning();
  }

  public resume() {
    if (this.isPaused) {
      this._isPaused = false;
      this._setTimeout();
    }
  }

  public pause() {
    if (!this.isPaused && this._timeoutId) {
      this._isPaused = true;
      this._clearTimeout();
    }
  }

  protected _handleTimeout() {
    this._callback?.();
    this._eventEmitter.emit('resolve');
    this._deferred?.resolve();
    this._deferred = null;
  }

  protected _setTimeout() {
    this._timeoutId = window.setTimeout(this._handleTimeout, this._duration);
  }

  protected _clearTimeout() {
    this._timeoutId && window.clearTimeout(this._timeoutId);
    this._timeoutId = null;
  }
}
