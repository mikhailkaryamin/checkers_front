import { Nullable } from 'src/types';
import { Deferred } from '../Deferred';
import { EventEmitter } from '../EventEmitter';
import { Events } from '../Events';
import { Done, EventTypeMap, OptionsOrCallback, Run } from './types';

export class CancellableAction<P = void, R = void> {
  protected readonly _eventEmitter = new EventEmitter<EventTypeMap<P, R>>();

  protected _run: Nullable<Run<P, R>>;

  protected _done: Nullable<Done<R>>;

  protected _cancel: Nullable<VoidFunction>;

  protected _result: Nullable<R> = null;

  protected _deferredRunning: Nullable<Deferred<void>> = null;

  protected _isSoftCancellationEnabled = false;

  protected _isCancelled = false;

  public constructor(optionsOrCallback?: OptionsOrCallback<P, R>) {
    const options =
      typeof optionsOrCallback === 'function' ? optionsOrCallback() : optionsOrCallback;

    this._run = options?.run ?? null;
    this._done = options?.done ?? null;
    this._cancel = options?.cancel ?? null;
  }

  public get events() {
    return new Events({ eventEmitter: this._eventEmitter });
  }

  public get result() {
    return this._result;
  }

  public get isRunning() {
    return !!this._deferredRunning;
  }

  public async run(param: P) {
    try {
      this._deferredRunning = new Deferred();
      this._isCancelled = false;
      await Promise.race([this._executeRun(param), this.waitWhenRunning()]);
      this._runDone();
    } catch (err) {
      if (!this._isSoftCancellationEnabled) {
        throw err;
      }
    }

    return this.result as R;
  }

  public cancel() {
    if (!this.isRunning) return;
    this._eventEmitter.emit('cancel');
    this._isSoftCancellationEnabled = false;
    this._isCancelled = true;
    this._rejectPromise();
    this._cancel?.();
  }

  public cancelSoft() {
    if (!this.isRunning) return;
    this._eventEmitter.emit('cancel');
    this._isSoftCancellationEnabled = true;
    this._isCancelled = true;
    this._rejectPromise();
    this._cancel?.();
  }

  public async waitWhenRunning() {
    await this._deferredRunning?.promise;
  }

  protected _resolvePromise() {
    this._deferredRunning?.resolve();
    this._deferredRunning = null;
  }

  protected _rejectPromise() {
    this._deferredRunning?.reject('Cancelled');
    this._deferredRunning = null;
  }

  protected async _executeRun(param: P) {
    this._result = null;

    if (this._run === null) {
      throw new Error('Nothing to run');
    }

    this._eventEmitter.emit('run', { param });
    const result = await this._run(param);

    if (this._deferredRunning) {
      this._resolvePromise();
      this._result = result ?? null;
    }
  }

  protected _runDone() {
    if (this._isCancelled) {
      throw new Error('Action was not performed');
    }

    const result = this.result as R;
    this._eventEmitter.emit('done', { result });
    this._done?.(result);
  }

  protected _setRun(run: Run<P, R>) {
    this._run = run;
  }

  protected _setDone(done: Done<R>) {
    this._done = done;
  }

  protected _setCancel(cancel: VoidFunction) {
    this._cancel = cancel;
  }
}
