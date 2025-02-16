import { bindAll } from 'lodash';
import { getPagePointByEvent } from 'src/shared/helpers/getPagePointByEvent';
import { Nullable, Point } from 'src/types';
import { EventEmitter } from '../EventEmitter';
import { Events } from '../Events';
import { eventNames } from './constants';
import { EventTypeMap } from './types';

export class DragStarter {
  readonly eventNames = eventNames;

  readonly events: Events<EventTypeMap>;

  private startEvent: Nullable<MouseEvent | TouchEvent> = null;

  private prevEvent: Nullable<MouseEvent | TouchEvent> = null;

  private eventEmitter = new EventEmitter<EventTypeMap>();

  private dragByClickEnabled = true;

  private beyondClickOffset = false;

  private clickDragInitialized = false;

  private defaultDragThreshold = 5;

  constructor() {
    bindAll(this, ['startDrag', 'moveDrag', 'finishDrag']);
    this.events = new Events({ eventEmitter: this.eventEmitter });
  }

  startDrag(event: MouseEvent | TouchEvent) {
    this.beyondClickOffset = false;

    if (this.clickDragInitialized) {
      this.clickDragInitialized = false;
      this.finishDrag(event);
    } else {
      this.startEvent = event;
      this.prevEvent = event;
      document.body.addEventListener('mousemove', this.moveDrag);
      document.body.addEventListener('mouseup', this.finishDrag);
      document.body.addEventListener('mouseleave', this.finishDrag);
      document.body.addEventListener('touchmove', this.moveDrag);
      document.body.addEventListener('touchend', this.finishDrag);
      document.body.addEventListener('touchcancel', this.finishDrag);
      this.eventEmitter.emit(eventNames.dragStart, {
        event,
        offsetPoint: { x: 0, y: 0 },
        diffPoint: { x: 0, y: 0 },
        element: this.startEvent!.target as HTMLElement,
      });
    }
  }

  clearDragListeners() {
    document.body.removeEventListener('mousemove', this.moveDrag);
    document.body.removeEventListener('mouseup', this.finishDrag);
    document.body.removeEventListener('mouseleave', this.finishDrag);
    document.body.removeEventListener('touchmove', this.moveDrag);
    document.body.removeEventListener('touchend', this.finishDrag);
    document.body.removeEventListener('touchcancel', this.finishDrag);
  }

  setDragByClickEnabled(value: boolean) {
    this.dragByClickEnabled = value;
  }

  private moveDrag(event: MouseEvent | TouchEvent) {
    const offsetPoint = this.getOffsetPointByEvents(this.startEvent!, event);
    const diffPoint = this.getOffsetPointByEvents(this.prevEvent!, event);
    this.prevEvent = event;

    if (
      Math.abs(offsetPoint.x) <= this.defaultDragThreshold &&
      Math.abs(offsetPoint.y) <= this.defaultDragThreshold &&
      !this.beyondClickOffset
    ) {
      return;
    }

    if (
      event.type === 'touchmove' ||
      Math.abs(offsetPoint.x) > 15 ||
      Math.abs(offsetPoint.y) > 15 ||
      !this.dragByClickEnabled
    ) {
      this.beyondClickOffset = true;
    }

    this.eventEmitter.emit(eventNames.dragMove, {
      event,
      offsetPoint,
      diffPoint,
      element: this.startEvent!.target as HTMLElement,
    });
  }

  private finishDrag(event: MouseEvent | TouchEvent) {
    const offsetPoint = this.getOffsetPointByEvents(this.startEvent!, event);

    if (this.beyondClickOffset || this.clickDragInitialized || !this.dragByClickEnabled) {
      this.clickDragInitialized = false;
      this.eventEmitter.emit(eventNames.dragFinish, {
        event,
        offsetPoint,
        diffPoint: { x: 0, y: 0 },
        element: this.startEvent!.target as HTMLElement,
        isBeyondClickOffset: this.beyondClickOffset,
      });
      this.startEvent = null;
      this.prevEvent = null;
      this.clearDragListeners();
    } else {
      this.clickDragInitialized = true;
    }
  }

  private getOffsetPointByEvents(
    startEvent: MouseEvent | TouchEvent,
    moveEvent: MouseEvent | TouchEvent,
  ) {
    const startPoint = getPagePointByEvent(startEvent);
    const movePoint = getPagePointByEvent(moveEvent);
    const offsetPoint = this.getOffsetPoint(startPoint, movePoint);
    return offsetPoint;
  }

  private getOffsetPoint(startPoint: Point, movePoint: Point) {
    return {
      x: movePoint.x - startPoint.x,
      y: movePoint.y - startPoint.y,
    };
  }
}
