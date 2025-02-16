import React from 'react';

export const useEffectOnMount = (callback: React.EffectCallback) => React.useEffect(callback, []);
