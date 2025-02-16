import React from 'react';

export const useEffectOnUpdate = (callback: React.EffectCallback, deps: React.DependencyList) => {
  const firstRender = React.useRef(true);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }

    return callback();
  }, [...deps]);
};
