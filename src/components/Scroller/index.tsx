import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useDefaultProps } from 'src/shared/hooks/useDefaultProps';
import { useEffectOnMount } from 'src/shared/hooks/useEffectOnMount';
import { Block } from '../Block';
import { defaultProps } from './constants';
import styles from './index.module.scss';
import { Scroller as ScrollerModel } from './store/Scroller';
import { Props } from './types';

export const Scroller = observer(
  React.forwardRef(function Scroller(props: Props, ref: React.ForwardedRef<HTMLDivElement>) {
    const {
      className,
      model: modelProp,
      x,
      y,
      step,
      autoScrollingEnabled,
      children,
      ...otherProps
    } = useDefaultProps(props, defaultProps);

    const model = React.useMemo(
      () =>
        modelProp ??
        new ScrollerModel({
          x,
          y,
          step,
          autoScrollingEnabled,
        }),
      [modelProp],
    );

    useEffectOnMount(() => {
      if (typeof ref === 'function') ref(model.element!);
      else if (ref) {
        ref.current = model.element;
      }
    });

    React.useEffect(() => {
      model.scrollTo({ x, y });
    }, [model, x, y]);

    React.useEffect(
      () => model.setAutoScrollingEnabled(autoScrollingEnabled),
      [model, autoScrollingEnabled],
    );

    React.useEffect(() => model.setStep(step), [model, step]);

    React.useEffect(() => () => model.clear(), [model]);

    return (
      <Block {...otherProps} className={cn(styles.main, className)}>
        <div ref={model.setElement} className={styles.wrap}>
          {children}
        </div>
      </Block>
    );
  }),
);
