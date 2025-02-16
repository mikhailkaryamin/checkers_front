import { observer } from 'mobx-react-lite';
import { ForwardedRef, forwardRef, MouseEventHandler, TouchEventHandler, useCallback } from 'react';
import { AnimatedReparentable } from 'src/components/AnimatedReparentable';
import { useCombinedRefs } from 'src/shared/hooks/useCombinedRefs';
import { Props } from './types';

export const Plate = observer(
  forwardRef(function Plate(props: Props, ref: ForwardedRef<HTMLDivElement>) {
    const { model, onMouseDown, onTouchStart, ...otherProps } = props;
    const innerRef = useCombinedRefs(ref);

    const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
      (event) => {
        model.startDrag(event);
        onMouseDown?.(event);
      },
      [onMouseDown],
    );

    const handleTouchStart: TouchEventHandler<HTMLDivElement> = useCallback(
      (event) => {
        model.startDrag(event);
        onTouchStart?.(event);
      },
      [onTouchStart],
    );

    return (
      <AnimatedReparentable
        {...otherProps}
        ref={innerRef}
        model={model}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
    );
  }),
);
