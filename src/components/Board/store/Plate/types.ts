import { EventTypeMap as AnimatedReparentableEventTypeMap } from 'src/components/AnimatedReparentable/store/AnimatedReparentable/types';
import {
    DragFinishData as DragStarterDragFinishData,
    EventTypeMap as DragStarterEventTypeMap,
} from 'src/shared/classes/DragStarter/types';
import { Nullable } from 'src/types';
import { Plate } from '.';
import { Slot } from '../Slot';

export type SetData = { plate: Plate; slot: Slot };
export type SetHandler = (data: SetData) => void;
export type UnsetData = SetData;
export type UnsetHandler = (data: UnsetData) => void;
export type EnterData = SetData;
export type EnterHandler = (data: EnterData) => void;
export type LeaveData = SetData;
export type LeaveHandler = (data: LeaveData) => void;
export type DragFinishData = DragStarterDragFinishData & {
  mostIntersectedSlot: Nullable<Slot>;
};
export type DragFinishHandler = (data: DragFinishData) => void;
export type AfterDragFinishHandler = DragFinishHandler;

export type EventTypeMap = Omit<DragStarterEventTypeMap, 'dragFinish'> &
  AnimatedReparentableEventTypeMap & {
    set: SetHandler;
    unset: UnsetHandler;
    enter: EnterHandler;
    leave: LeaveHandler;
    dragFinish: DragFinishHandler;
  };

export type EventName = keyof EventTypeMap;

export type Options = {
  slot: Slot;
  slots: Slot[];
  afterDragFinishHandler?: Nullable<AfterDragFinishHandler>;
  enabled?: boolean;
  isDragByClickEnabled?: boolean;
};
