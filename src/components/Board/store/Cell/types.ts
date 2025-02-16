import { Nullable, Point } from 'src/types';
export type PieceColor = 'w' | 'b';
export type Color = PieceColor;

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
  color: Color;
  selectionType?: Nullable<SelectionType>;
  hoverable?: boolean;
  hovered?: boolean;
  isEnabled?: boolean;
};
