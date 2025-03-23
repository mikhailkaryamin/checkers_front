import React from 'react';
import { Props } from './types';

export const Text = (props: Props) => {
  const { value } = props;
  const parts = value.split('\n').map((p) => p.trim());

  return (
    <>
      {parts.map((part, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={i}>
          {part}
          {i !== parts.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};
