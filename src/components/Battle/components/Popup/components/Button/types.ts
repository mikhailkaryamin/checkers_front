import React from 'react';
import { Clicker } from 'src/shared/classes/Clicker';

export type Type = 'retry' | 'next' | 'yes' | 'no';

export type Props = React.HTMLAttributes<HTMLDivElement> & {
  type: Type;
  model: {
    clicker: Clicker;
  };
};
