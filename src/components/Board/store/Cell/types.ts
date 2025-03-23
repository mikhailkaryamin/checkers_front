import { Nullable, Point, Side } from 'src/types';

export type SelectionType =
  | 'fill'
  | 'border'
  | 'corners'
  | 'dot'
  | 'check'
  | 'target'
  | 'checkmate'
  | 'pulsePoint'
  | 'pulseRedPoint'
  | 'overlap'
  | 'weakFill'
  | 'highlight'
  | 'highlight2';

export type Options = {
  coordinate: Point;
  color: Side;
  selectionType?: Nullable<SelectionType>;
  hoverable?: boolean;
  hovered?: boolean;
  isEnabled?: boolean;
};
