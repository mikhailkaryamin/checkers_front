import { action, makeObservable, observable } from 'mobx';
import { MouseEvent, TouchEvent } from 'react';
import { AnimatedReparentable } from 'src/components/AnimatedReparentable/store/AnimatedReparentable';
import { Activity } from 'src/shared/classes/Activity';
import { Deferred } from 'src/shared/classes/Deferred';
import { DragStarter } from 'src/shared/classes/DragStarter';
import { eventNames as dragStarterEventNames } from 'src/shared/classes/DragStarter/constants';
import {
    DragMoveData,
    DragStartData,
    DragFinishData as DragStarterDragFinishData,
} from 'src/shared/classes/DragStarter/types';
import { EventEmitter } from 'src/shared/classes/EventEmitter';
import { Events } from 'src/shared/classes/Events';
import { getIntersectionArea } from 'src/shared/helpers/getIntersectionArea';
import { Nullable } from 'src/types';
import { Slot } from '../Slot';
import { eventNames } from './constants';
import { AfterDragFinishHandler, DragFinishData, EventTypeMap, Options } from './types';

export class Plate extends AnimatedReparentable {
  public readonly eventNames = eventNames;

  public readonly events: Events<EventTypeMap>;

  public readonly activity: Activity;

  public readonly dragStarter = new DragStarter();

  protected eventEmitter = new EventEmitter<EventTypeMap>();

  protected _afterDragFinishHandler: Nullable<AfterDragFinishHandler> = (data) =>
    this.moveToSlot(data.mostIntersectedSlot ?? this.slot);

  @observable
  protected _slots: Slot[] = [];

  @observable
  protected _slot: Slot;

  @observable
  protected _isDragging = false;

  protected _deferredDragStart: Nullable<Deferred<DragStartData>> = null;

  protected _deferredDragFinish: Nullable<Deferred<DragFinishData>> = null;

  constructor(options: Options) {
    super();
    makeObservable(this);
    this.events = new Events({ eventEmitter: this.eventEmitter });
    this.activity = new Activity({ enabled: options.enabled });
    this.dragStarter.setDragByClickEnabled(options.isDragByClickEnabled ?? true);
    this._afterDragFinishHandler =
      options.afterDragFinishHandler === undefined
        ? this._afterDragFinishHandler
        : options.afterDragFinishHandler;
    this._slot = options.slot;
    this._slot.addPlate(this);
    this._slots = options.slots;
    this._init();
  }

  public get slots() {
    return this._slots;
  }

  public get slot() {
    return this._slot;
  }

  public get isDragging() {
    return this._isDragging;
  }

  public loadElement(element: Nullable<HTMLElement>) {
    element && super.loadElement(element);
    this.setSlotWithWaitElementSet(this.slot);
  }

  @action.bound
  public setSlot(slot: Slot) {
    const prevSlot = this.slot;
    this._slot.removePlate(this);
    this._slot = slot;

    this.eventEmitter.emit(eventNames.unset, { plate: this, slot: prevSlot });
    this.eventEmitter.emit(eventNames.set, { plate: this, slot });

    if (this.element !== null && slot.element !== null) {
      this.slot.addPlate(this);
      this.setAnchor(slot.element);
    }
  }

  public async setSlotWithWaitElementSet(slot: Slot) {
    await Promise.all([slot.waitWhenElementSet(), this.waitWhenElementSet()]);
    this.setSlot(slot);
  }

  @action.bound
  public async moveToSlot(slot: Slot) {
    const prevSlot = this.slot;
    this._slot.removePlate(this);
    this._slot = slot;

    this.eventEmitter.emit(eventNames.unset, { plate: this, slot: prevSlot });
    this.eventEmitter.emit(eventNames.set, { plate: this, slot });

    if (this.element !== null && slot.element !== null) {
      this.slot.addPlate(this);
      await this.moveTo(slot.element);
    }
  }

  @action.bound
  public startDrag(event: MouseEvent | TouchEvent) {
    if (this.activity.enabled) {
      this.dragStarter.startDrag(event.nativeEvent);
    }
  }

  public async waitDragStart() {
    this._deferredDragStart = new Deferred();
    const data = await this._deferredDragStart.promise;
    return data;
  }

  public async waitDragFinish() {
    this._deferredDragFinish = new Deferred();
    const data = await this._deferredDragFinish.promise;
    return data;
  }

  public setAfterDragFinishHandler(afterDragFinishHandler: Nullable<AfterDragFinishHandler>) {
    this._afterDragFinishHandler = afterDragFinishHandler;
  }

  public prepareToUnmount() {
    super.prepareToUnmount();
    this.slot.removePlate(this);
  }

  @action.bound
  protected handleDragStart(data: DragStartData) {
    this._isDragging = true;
    this.eventEmitter.emit(eventNames.dragStart, data);
    this._deferredDragStart?.resolve(data);
    this.stop();
  }

  @action.bound
  protected handleDragMove(data: DragMoveData) {
    this.eventEmitter.emit(eventNames.dragMove, data);

    const mostIntersectedSlot = this.getMostIntersectedSlot();
    if (mostIntersectedSlot) mostIntersectedSlot.setHoveredPlate(this);

    this.slots.forEach((slot) => {
      if (slot.activity.disabled) return;

      if (this.element === null || slot.element === null) {
        slot.setHoveredPlate(null);
        return;
      }
      if (slot !== mostIntersectedSlot) {
        slot.setHoveredPlate(null);
      }
    });

    this.setCurrent({
      x: this.current.x + data.diffPoint.x,
      y: this.current.y + data.diffPoint.y,
    });
  }

  @action.bound
  protected handleDragFinish(data: DragStarterDragFinishData) {
    const mostIntersectedSlot = this.getMostIntersectedSlot();
    const currentData = { ...data, mostIntersectedSlot };
    this._isDragging = false;
    this.eventEmitter.emit(eventNames.dragFinish, currentData);
    this._deferredDragFinish?.resolve(currentData);
    this._afterDragFinishHandler?.(currentData);
  }

  protected getMostIntersectedSlot() {
    const { slot: mostIntersectedSlot } = this.slots.reduce(
      (acc, slot) => {
        if (this.element === null || slot.element === null || slot.activity.disabled) {
          return acc;
        }

        const intersectionArea = getIntersectionArea(
          this.element.getBoundingClientRect(),
          slot.element.getBoundingClientRect(),
        );

        const area = intersectionArea.width * intersectionArea.height;

        return area > acc.area ? { slot, area } : acc;
      },
      { slot: null, area: 0 } as { slot: Nullable<Slot>; area: number },
    );

    return mostIntersectedSlot;
  }

  protected async _init() {
    this.dragStarter.events.on(dragStarterEventNames.dragStart, this.handleDragStart);
    this.dragStarter.events.on(dragStarterEventNames.dragMove, this.handleDragMove);
    this.dragStarter.events.on(dragStarterEventNames.dragFinish, this.handleDragFinish);
    await Promise.all([this._slot.waitWhenElementSet(), this.waitWhenElementSet()]);
    this.setAnchor(this._slot.element);
  }
}
