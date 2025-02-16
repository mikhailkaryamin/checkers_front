import { action, makeObservable, observable } from 'mobx';
import { Activity } from 'src/shared/classes/Activity';
import { Deferred } from 'src/shared/classes/Deferred';
import { EventEmitter } from 'src/shared/classes/EventEmitter';
import { Events } from 'src/shared/classes/Events';
import { Nullable } from 'src/types';
import { Plate } from '../Plate';
import { eventNames } from './constants';
import { EventTypeMap } from './types';

export class Slot {
  public readonly events: Events<EventTypeMap>;

  public readonly activity: Activity;

  protected eventEmitter = new EventEmitter<EventTypeMap>();

  @observable
  protected _element: Nullable<HTMLElement> = null;

  @observable
  protected _plates: Plate[] = [];

  @observable
  protected _hoveredPlate: Nullable<Plate> = null;

  protected _deferredElementSet = new Deferred<void>();

  public constructor(options?: { enabled?: boolean }) {
    makeObservable(this);
    this.events = new Events({ eventEmitter: this.eventEmitter });
    this.activity = new Activity({ enabled: options?.enabled });
  }

  public get element() {
    return this._element;
  }

  public get plates() {
    return this._plates;
  }

  public get hoveredPlate() {
    return this._hoveredPlate;
  }

  public get isEmpty() {
    return this.plates.length === 0;
  }

  @action.bound
  public loadElement(element: Nullable<HTMLElement>) {
    this._element = element;
    this._deferredElementSet.resolve();
    this.plates.forEach((plate) => plate.setSlot(this));
  }

  public setHoveredPlate(hoveredPlate: Nullable<Plate>) {
    const prevHoveredPlate = this.hoveredPlate;
    this._hoveredPlate = hoveredPlate;

    if (prevHoveredPlate === hoveredPlate) return;

    if (prevHoveredPlate) {
      this.eventEmitter.emit(eventNames.leave, { slot: this, plate: prevHoveredPlate });
    }

    if (hoveredPlate) {
      this.eventEmitter.emit(eventNames.enter, { slot: this, plate: hoveredPlate });
    }
  }

  public enterPlate(params: { plate: Plate }) {
    this.eventEmitter.emit(eventNames.enter, { slot: this, plate: params.plate });
  }

  public leavePlate(params: { plate: Plate }) {
    this.eventEmitter.emit(eventNames.leave, { slot: this, plate: params.plate });
  }

  @action
  public addPlate(plate: Plate) {
    this._plates.push(plate);
    this.eventEmitter.emit(eventNames.set, { plate, slot: this });
  }

  public removePlate(plate: Plate) {
    this._plates = this._plates.filter((p) => p !== plate);
    this.eventEmitter.emit(eventNames.set, { plate, slot: this });
  }

  @action.bound
  public resetElement() {
    const hasChildren = this._element?.childNodes.length;
    if (this._element && hasChildren) {
      const children = Array.from(this._element.childNodes);
      children.forEach((child) => this._element?.removeChild(child));
    }
  }

  public async waitWhenElementSet() {
    await this._deferredElementSet.promise;
  }
}
