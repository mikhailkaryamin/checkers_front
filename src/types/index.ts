export type Nullable<T> = T | null;
export type StrictRecord<T extends string> = { [key in T]: key };
export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export type BaseObject = Record<any, any>;
export type CheckerPoint = { h: string; v: string };
export type Side = 'w' | 'b';
