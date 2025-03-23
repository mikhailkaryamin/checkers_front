import { Deferred } from '../Deferred';
import { EventTypeMap } from '../EventEmitter/types';
import { Events } from '../Events';
import { EventData } from './types';

export class ObjectEventWaiter {
  protected _objectWraps: { listen: VoidFunction; unlisten: VoidFunction }[] = [];

  public static async wait<T extends EventTypeMap>(
    objects: { events: Events<T> }[],
    eventType: keyof T,
  ) {
    const waiter = new ObjectEventWaiter();
    const result = await waiter.wait(objects, eventType);
    return result;
  }

  public async wait<T extends EventTypeMap>(objects: { events: Events<T> }[], eventType: keyof T) {
    const deferred = new Deferred<EventData<T>>();
    this._objectWraps = objects.map((object, i) => {
      const resolve: (...args: any[]) => void = (...args) =>
        // @ts-ignore
        deferred.resolve({ index: i, eventType, args });

      return {
        listen: () => object.events.on(eventType, resolve as T[keyof T]),
        unlisten: () => object.events.off(eventType, resolve as T[keyof T]),
      };
    });

    this._objectWraps.forEach((object) => object.listen());
    const result = await deferred.promise;
    this.cancel();

    return result;
  }

  public cancel() {
    this._objectWraps.forEach((object) => object.unlisten());
  }
}
