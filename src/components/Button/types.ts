import React from 'react';

export type Color = 'white' | 'white-orange' | 'orange' | 'purple';

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  classNames?: {
    main?: string;
    content?: string;
  };
  color?: Color;
  disabled?: boolean;
  hasPadding?: boolean;
  isHoverable?: boolean;
};
