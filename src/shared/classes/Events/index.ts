import { EventEmitter } from '../EventEmitter';
import { EventTypeMap } from '../EventEmitter/types';

export class Events<T extends EventTypeMap = EventTypeMap> {
  private eventEmitter: EventEmitter<T>;

  constructor(options: { eventEmitter: EventEmitter<T> }) {
    this.eventEmitter = options.eventEmitter;
  }

  on<E extends keyof T>(eventType: E, handler: T[E]) {
    this.eventEmitter.on(eventType, handler);
  }

  once<E extends keyof T>(eventType: E, handler: T[E]) {
    this.eventEmitter.on(eventType, handler);
  }

  off<E extends keyof T>(eventType: E, handler: T[E]) {
    this.eventEmitter.off(eventType, handler);
  }

  removeAllListeners<E extends keyof T>(eventType?: E) {
    this.eventEmitter.removeAllListeners(eventType);
  }
}
