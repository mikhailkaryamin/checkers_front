import React from 'react';

export const setForwardedRefCurrent = <T>(ref: React.ForwardedRef<T>, current: T) => {
  if (ref === null) return;

  if (typeof ref === 'function') {
    ref(current || null);
  } else {
    const currentRef = ref;
    currentRef.current = current || null;
  }
};
