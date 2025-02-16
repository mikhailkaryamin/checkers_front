import React from 'react';

export const useCombinedRefs = <T>(...refs: React.ForwardedRef<T>[]) => {
  const targetRef = React.useRef<T>();

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current || null);
      } else {
        const currentRef = ref;
        currentRef.current = targetRef.current || null;
      }
    });
  }, [refs]);

  return targetRef as React.MutableRefObject<T>;
};
