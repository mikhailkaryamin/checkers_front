import { Slot } from '.';
import { Plate } from '../Plate';

export type SetData = { plate: Plate; slot: Slot };
export type SetHandler = (data: SetData) => void;
export type UnsetData = SetData;
export type UnsetHandler = (data: UnsetData) => void;
export type EnterData = SetData;
export type EnterHandler = (data: EnterData) => void;
export type LeaveData = SetData;
export type LeaveHandler = (data: SetData) => void;

export type EventTypeMap = {
  set: SetHandler;
  unset: UnsetHandler;
  enter: EnterHandler;
  leave: LeaveHandler;
};

export type EventName = keyof EventTypeMap;
