import React from 'react';
import { isUndefined, omitBy } from 'lodash';
import { BaseObject } from 'src/types';

export const useDefaultProps = <P extends BaseObject, D extends BaseObject>(
  props: P,
  defaultProps: D,
): P & D =>
  React.useMemo(() => {
    const propsWithoutUndefined = omitBy(props, isUndefined) as P;
    return { ...defaultProps, ...propsWithoutUndefined };
  }, [defaultProps, props]);
