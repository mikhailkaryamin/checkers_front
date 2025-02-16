import { observer } from 'mobx-react-lite';
import { ForwardedRef, forwardRef } from 'react';
import { useCombinedRefs } from 'src/shared/hooks/useCombinedRefs';
import { useEffectOnMount } from 'src/shared/hooks/useEffectOnMount';
import { Props } from './types';

export const Slot = observer(
  forwardRef(function Slot(props: Props, ref: ForwardedRef<HTMLDivElement>) {
    const { model, ...otherProps } = props;
    const innerRef = useCombinedRefs(ref);

    useEffectOnMount(() => model.loadElement(innerRef.current));

    return <div {...otherProps} ref={innerRef} />;
  }),
);
