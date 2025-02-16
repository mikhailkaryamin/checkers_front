export type Resolver<T> = (value: T | PromiseLike<T>) => void;

export type Rejecter = (reason: string) => void;

export type WaitCallback<T> = () => Promise<T>;

export type DeferredState = 'resolved' | 'rejected' | 'cancelled' | 'pending';
