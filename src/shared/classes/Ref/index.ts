import { action, makeObservable, observable } from 'mobx';
import { Deferred } from 'src/shared/classes/Deferred';
import { reflowElement } from 'src/shared/helpers/reflowElement';
import { waitFrame } from 'src/shared/helpers/waitFrame';
import { Nullable } from 'src/types';
import { EventEmitter } from '../EventEmitter';
import { Events } from '../Events';
import { EventTypeMap } from './types';

export class Ref<T extends HTMLElement = HTMLDivElement> {
  protected readonly _eventEmitter = new EventEmitter<EventTypeMap>();

  @observable
  protected _current: Nullable<T> = null;

  protected _deferredSet: Nullable<Deferred<void>> = new Deferred();

  protected _deferredUnset: Nullable<Deferred<void>> = null;

  public constructor() {
    makeObservable(this);
  }

  public get events() {
    return new Events({ eventEmitter: this._eventEmitter });
  }

  public get current() {
    return this._current;
  }

  public get isSet() {
    return !!this.current;
  }

  @action.bound
  public setCurrent(current: Nullable<T>) {
    this._current = current;

    if (current) {
      this._deferredUnset = new Deferred();
      this._deferredSet?.resolve();
      this._deferredSet = null;
      this._eventEmitter.emit('set');
    } else {
      this._deferredSet = new Deferred();
      this._deferredUnset?.resolve();
      this._deferredUnset = null;
      this._eventEmitter.emit('unset');
    }
  }

  public async waitWhenSet() {
    await this._deferredSet?.promise;
  }

  public async waitWhenSetWithReflow() {
    await this.waitWhenSet();

    const current = this.current;
    if (current) {
      await waitFrame();
      reflowElement(current);
    }
  }

  public async waitWhenUnset() {
    await this._deferredUnset?.promise;
  }

  public async waitSet() {
    this._deferredSet = new Deferred();
    await this._deferredSet.promise;
  }
}
