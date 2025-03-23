import { Board } from 'src/components/Board/store/Board';
import { Options as PlateOptions } from 'src/components/Board/store/Plate/types';
import { Side } from 'src/types';
import { Pieces } from '../Pieces';

export type Options = PlateOptions & {
  chessBoard: Board;
  pieces: Pieces;
  side: Side;
  isShown?: boolean;
  isHovered?: boolean;
  isHoverable?: boolean;
  isDarkCloudLottieNeed?: boolean;
  isLightCloudLottieNeed?: boolean;
  isBlinkLottieNeed?: boolean;
};
