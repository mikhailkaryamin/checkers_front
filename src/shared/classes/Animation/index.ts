import { action, makeObservable, observable } from 'mobx';
import { Deferred } from 'src/shared/classes/Deferred';
import { Nullable } from 'src/types';
import { EventEmitter } from '../EventEmitter';
import { Events } from '../Events';
import { eventNames } from './constants';
import { EventTypeMap, Options } from './types';

export class Animation {
  readonly eventNames = eventNames;

  readonly events: Events<EventTypeMap>;

  protected eventEmitter = new EventEmitter<EventTypeMap>();

  @observable
  protected _animating = false;

  protected deferred: Nullable<Deferred<void>> = null;

  protected deferredWait: Nullable<Deferred<void>> = null;

  constructor(options?: Options) {
    makeObservable(this);
    this.events = new Events({ eventEmitter: this.eventEmitter });
    this._animating = options?.animating ?? this._animating;
  }

  get animating() {
    return this._animating;
  }

  @action.bound
  start() {
    this._animating = true;
    this.deferred = new Deferred<void>();
    this.eventEmitter.emit(eventNames.start);
  }

  @action.bound
  stop() {
    this._animating = false;
    this.deferred?.resolve();
    this.deferredWait?.resolve();
    this.deferred = null;
    this.deferredWait = null;
    this.eventEmitter.emit(eventNames.stop);
  }

  @action.bound
  finish() {
    this._animating = false;
    this.deferred?.resolve();
    this.deferredWait?.resolve();
    this.deferred = null;
    this.deferredWait = null;
    this.eventEmitter.emit(eventNames.finish);
  }

  @action.bound
  async waitWhenAnimating() {
    await this.deferred?.promise;
  }

  @action.bound
  async waitAnimation() {
    this.deferredWait = new Deferred<void>();
    await this.deferredWait.promise;
  }
}
