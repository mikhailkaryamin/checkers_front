import { makeAutoObservable } from 'mobx';

export class Activity {
  private _enabled = true;

  constructor(options?: { enabled?: boolean }) {
    makeAutoObservable(this, {}, { autoBind: true });
    this._enabled = options?.enabled ?? this._enabled;
  }

  get enabled() {
    return this._enabled;
  }

  get disabled() {
    return !this._enabled;
  }

  enable() {
    this._enabled = true;
  }

  disable() {
    this._enabled = false;
  }

  toggle(enabled: boolean) {
    this._enabled = enabled;
  }
}
