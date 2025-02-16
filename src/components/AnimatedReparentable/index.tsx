import { observer } from 'mobx-react-lite';
import { ForwardedRef, forwardRef, useEffect, useMemo } from 'react';
import { useCombinedRefs } from 'src/shared/hooks/useCombinedRefs';
import { Block } from '../Block';
import { Props } from './types';

export const AnimatedReparentable = observer(
  forwardRef(function AnimatedReparentable(
    props: Props,
    ref: ForwardedRef<HTMLDivElement>,
  ) {
    const { model, style: styleProp, ...otherProps } = props;
    const innerRef = useCombinedRefs(ref);

    const style = useMemo(
      () => ({
        ...styleProp,
        transform: `translate(${model.point.x}px, ${model.point.y}px)`,
      }),
      [model.point.x, model.point.y, styleProp],
    );

    useEffect(() => model.loadElement(innerRef.current), [innerRef, model]);

    return <Block {...otherProps} ref={innerRef} style={style} />;
  }),
);
