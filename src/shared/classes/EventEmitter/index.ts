import { EventEmitter as EventEmitterBase } from 'events';
import { EventTypeMap } from './types';

export class EventEmitter<T extends EventTypeMap> {
  private events: EventEmitterBase;

  constructor() {
    this.events = new EventEmitterBase();
  }

  on<E extends keyof T>(eventType: E, handler: T[E]) {
    this.events.on(eventType as string | symbol, handler);
  }

  once<E extends keyof T>(eventType: E, handler: T[E]) {
    this.events.once(eventType as string | symbol, handler);
  }

  off<E extends keyof T>(eventType: E, handler: T[E]) {
    this.events.off(eventType as string | symbol, handler);
  }

  removeAllListeners<E extends keyof T>(eventType?: E) {
    this.events.removeAllListeners(eventType as string | symbol | undefined);
  }

  emit<E extends keyof T>(eventType: E, ...args: Parameters<T[E]>) {
    this.events.emit(eventType as string | symbol, ...args);
  }

  setMaxListeners(numberOfListeners: number) {
    this.events.setMaxListeners(numberOfListeners);
  }
}
