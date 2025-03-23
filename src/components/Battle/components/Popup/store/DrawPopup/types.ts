import { Side } from 'src/types';

export type Options = {
  isShown?: boolean;
  playerSide: Side;
};

export type ShowParams = {
  scoreCount: number;
  playerSide: Side;
};
