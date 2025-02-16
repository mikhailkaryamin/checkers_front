import { HTMLAttributes } from 'react';
import { Params } from 'src/shared/helpers/getBlockStyles/types';

export type HoverData = { hovered: boolean };
export type HoverHandler = (data: HoverData) => void;

export type Props = HTMLAttributes<HTMLDivElement> &
  Params & {
    onHover?: HoverHandler;
  };
