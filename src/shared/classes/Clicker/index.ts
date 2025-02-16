import { makeAutoObservable } from 'mobx';
import { Deferred } from 'src/shared/classes/Deferred';
import { Nullable } from 'src/types';
import { Activity } from '../Activity';
import { EventEmitter } from '../EventEmitter';
import { Events } from '../Events';
import { EventTypeMap } from './types';

export class Clicker {
  readonly activity: Activity;

  readonly events: Events<EventTypeMap>;

  private eventEmitter = new EventEmitter<EventTypeMap>();

  private deferredClick: Nullable<Deferred<void>> = null;

  constructor(options?: { enabled?: boolean }) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.activity = new Activity({ enabled: options?.enabled });
    this.events = new Events({ eventEmitter: this.eventEmitter });
  }

  get disabled() {
    return this.activity.disabled;
  }

  get enabled() {
    return this.activity.enabled;
  }

  click() {
    if (this.activity.disabled) return;
    this.deferredClick?.resolve();
    this.eventEmitter.emit('click');
  }

  async waitClick() {
    this.deferredClick = new Deferred();
    await this.deferredClick.promise;
    this.resetWait();
  }

  resetWait() {
    this.deferredClick = null;
  }

  enable() {
    this.activity.enable();
  }

  disable() {
    this.activity.disable();
  }

  toggle(enabled = !this.activity.enabled) {
    this.activity.toggle(enabled);
  }
}
