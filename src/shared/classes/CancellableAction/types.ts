import { Nullable } from 'src/types';

export type Run<P, R> = (param: P) => R | Promise<R>;

export type Done<P> = (param: P) => void;

export type Options<P, R> = {
  run?: Run<P, R>;
  done?: Done<R>;
  cancel?: Nullable<VoidFunction>;
};

export type OptionsOrCallback<P, R> = Options<P, R> | (() => Options<P, R>);

export type RunData<P> = { param: P };
export type RunHandler<P> = (data: RunData<P>) => void;
export type DoneData<R> = { result: R };
export type DoneHandler<R> = (data: DoneData<R>) => void;
export type CancelHandler = VoidFunction;

export type EventTypeMap<P, R> = {
  run: RunHandler<P>;
  done: DoneHandler<R>;
  cancel: CancelHandler;
};
