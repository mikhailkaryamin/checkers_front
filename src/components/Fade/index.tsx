import { observer } from 'mobx-react-lite';
import React from 'react';
import { setForwardedRefCurrent } from 'src/shared/helpers/setRefCurrent';
import { useDefaultProps } from 'src/shared/hooks/useDefaultProps';
import { useEffectOnUpdate } from 'src/shared/hooks/useEffectOnUpdate';
import { Block } from '../Block';
import { defaultProps } from './constants';
import { Fade as FadeModel } from './store/Fade';
import { Props } from './types';

export const Fade = observer(
  React.forwardRef(function Fade(props: Props, ref: React.ForwardedRef<HTMLDivElement>) {
    const innerProps = useDefaultProps(props, defaultProps);
    const {
      model: modelProp,
      shown,
      duration,
      delay,
      easing,
      style: styleProp,
      hasUnmount,
      isUsingRef,
      onFadeEnd,
      onTransitionEnd,
      ...otherProps
    } = innerProps;

    const model = React.useMemo(
      () =>
        modelProp ??
        new FadeModel({
          shown,
          duration,
          delay,
          easing,
          hasUnmount,
        }),
      [modelProp],
    );

    const style = React.useMemo(() => {
      const result = {
        ...styleProp,
        transition: model.animating
          ? `opacity ${model.duration}ms ${model.delay}ms ${model.easing}`
          : '',
        opacity: model.shown ? 1 : 0,
        visibility: model.hiddenStatic ? 'hidden' : 'visible',
      } as React.CSSProperties;

      if (styleProp?.transition) {
        result.transition = styleProp.transition;
      }

      return result;
    }, [styleProp, model.animating, model.duration, model.delay, model.easing, model.shown]);

    const handleTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = React.useCallback(
      (e) => {
        if (e.target === model.ref.current && e.propertyName === 'opacity') {
          model.finish();
          onFadeEnd?.({ shown: model.shown });
        }

        onTransitionEnd?.(e);
      },
      [model.ref, model, onFadeEnd, onTransitionEnd],
    );

    useEffectOnUpdate(() => model.setEasing(easing), [easing]);

    useEffectOnUpdate(() => model.setDuration(duration), [duration]);

    useEffectOnUpdate(() => model.setDelay(delay), [delay]);

    useEffectOnUpdate(() => model.setHasUnmount(hasUnmount), [hasUnmount]);

    useEffectOnUpdate(() => {
      model.toggle({ shown });
    }, [shown]);

    useEffectOnUpdate(() => {
      setForwardedRefCurrent(ref, model.ref.current);
    }, [model.ref.current]);

    return (
      <>
        {model.isMounted && (
          <Block
            {...otherProps}
            ref={(element) => {
              if (isUsingRef && element && model.ref.current !== element) {
                model.ref.setCurrent(element);
              }
            }}
            style={style}
            onTransitionEnd={handleTransitionEnd}
          />
        )}
      </>
    );
  }),
);
