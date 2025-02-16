import anime, { AnimeInstance, AnimeParams } from 'animejs';
import { action, makeObservable, observable } from 'mobx';
import { BaseObject, Nullable } from 'src/types';
import { Animation } from '../Animation';
import { EventEmitter } from '../EventEmitter';
import { Events } from '../Events';
import { eventNames } from './constants';
import { EventTypeMap } from './types';

export class Anime<T extends BaseObject> extends Animation {
  readonly eventNames = eventNames;

  readonly events: Events<EventTypeMap>;

  protected _target: T;

  @observable
  protected _current: T;

  @observable
  protected animeInstance: Nullable<AnimeInstance> = null;

  protected eventEmitter = new EventEmitter<EventTypeMap>();

  constructor(current: T) {
    super();
    makeObservable(this);
    this.events = new Events({ eventEmitter: this.eventEmitter });
    this._target = current;
    this._current = current;
  }

  get current() {
    return this._current;
  }

  get target() {
    return this._target;
  }

  @action.bound
  setCurrent(current: T) {
    this._current = current;
  }

  stop() {
    if (this.animeInstance) {
      super.stop();
      this.animeInstance.pause();
      this.animeInstance = null;
    }
  }

  @action.bound
  pause() {
    if (this.animeInstance) {
      super.stop();
      this.animeInstance.pause();
    }
  }

  @action.bound
  continue() {
    if (this.animeInstance) {
      super.start();
      this.animeInstance.play();
    }
  }

  @action.bound
  async animate(params?: AnimeParams) {
    const currentAnimeData = { ...this.current };
    this._target = params as T;

    this.stop();

    if (params?.duration === 0) {
      this.start();
      this.setCurrent(this._target);
      this.finish();
      return;
    }

    super.start();
    this.animeInstance = anime({
      targets: currentAnimeData,
      ...params,
      update: (anim) => {
        this.setCurrent({ ...currentAnimeData });
        params?.update?.(anim);
        this.eventEmitter.emit(eventNames.update);
      },
      complete: (anim) => {
        this.setCurrent({ ...currentAnimeData });
        params?.complete?.(anim);
        this.finish();
        this.animeInstance = null;
      },
    });

    await this.waitWhenAnimating();
  }
}
