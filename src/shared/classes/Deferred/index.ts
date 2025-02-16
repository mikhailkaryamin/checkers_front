import { DeferredState, Rejecter, Resolver, WaitCallback } from './types';

export class Deferred<T> {
  protected readonly _promise: Promise<T>;

  protected _resolvePromise!: Resolver<T>;

  protected _rejectPromise!: Rejecter;

  protected _state: DeferredState = 'pending';

  public constructor() {
    this._promise = new Promise((resolve, reject) => {
      this._resolvePromise = resolve;
      this._rejectPromise = reject;
    });
  }

  public static get cancelReason() {
    return 'Cancelled';
  }

  public get promise() {
    return this._promise;
  }

  public get state() {
    return this._state;
  }

  public resolve(value: T) {
    this._state = 'resolved';
    this._resolvePromise(value);
  }

  public reject(reason: string) {
    this._state = reason === Deferred.cancelReason ? 'cancelled' : 'rejected';
    this._rejectPromise(reason);
  }

  public cancel() {
    this.reject(Deferred.cancelReason);
  }

  public async wait() {
    return await this._promise;
  }

  public async waitCallback(callback: WaitCallback<T>) {
    callback().then(this.resolve);
    return await this._promise;
  }
}
