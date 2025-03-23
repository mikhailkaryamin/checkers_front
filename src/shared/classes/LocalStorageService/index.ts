import { merge } from 'lodash';
import { makeAutoObservable } from "mobx";

export class LocalStorageService<T> {
  protected readonly _defaultData: T;

  public constructor(defaultData: T) {
    makeAutoObservable(this);

    this._defaultData = defaultData;
  }

  public get localStorageKey() {
    return 'checkers'
  }

  public get data(): T {
    const currentData = merge({}, this._defaultData, this._getLocalStorageDataSafely());
    localStorage.setItem(this.localStorageKey, JSON.stringify(currentData));
    return currentData;
  }

  public update(partial: Partial<T>) {
    const currentData = merge(this.data, partial);
    localStorage.setItem(this.localStorageKey, JSON.stringify(currentData));
    return currentData;
  }

  public getData(key: string) {
    return this._getLocalStorageDataSafely(key);
  }

  protected _getLocalStorageDataSafely(key = this.localStorageKey) {
    const localStorageValue = localStorage.getItem(key);
    try {
      return localStorageValue ? JSON.parse(localStorageValue) : {};
    } catch {
      return {};
    }
  }
}
