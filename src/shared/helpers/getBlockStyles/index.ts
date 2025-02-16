import cn from 'classnames';
import { Params } from './types';

export const getStyles = (params?: Params) =>
  cn(
    'block',
    params?.fullSize && 'block_fullSize',
    params?.absolute && 'block_absolute',
    params?.flex && 'block_flex',
    typeof params?.flex === 'object' && params.flex.centered && 'block_flex_centered',
    typeof params?.flex === 'object' && params.flex.alignedCenter && 'block_flex_aligned_center',
    typeof params?.flex === 'object' &&
      params.flex.justifiedCenter &&
      'block_flex_justified_center',
  );
