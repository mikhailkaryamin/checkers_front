import cn from 'classnames';
import { forwardRef, useEffect, useState } from 'react';
import { getStyles } from 'src/shared/helpers/getBlockStyles';
import { matchMedia } from 'src/shared/helpers/matchMedia';
import { useCombinedRefs } from 'src/shared/hooks/useCombinedRefs';
import { useEffectOnUpdate } from 'src/shared/hooks/useEffectOnUpdate';
import { defaultProps } from './constants';
import { Props } from './types';

export const Block = forwardRef<HTMLDivElement, Props>(function Block(props, ref) {
  const { className, fullSize, absolute, flex, onHover, ...otherProps } = props;
  const [hovered, setHovered] = useState(false);
  const innerRef = useCombinedRefs(ref);

  useEffect(() => {
    if (!onHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (matchMedia('(hover: none)').matches) return;

      const cardItemIsHovered = !!(
        e.target instanceof Node &&
        innerRef.current &&
        innerRef.current.contains(e.target)
      );

      setHovered(cardItemIsHovered);
    };

    document.body.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onHover]);

  useEffectOnUpdate(() => onHover?.({ hovered }), [hovered]);

  return (
    <div
      {...otherProps}
      ref={innerRef}
      className={cn(getStyles({ fullSize, absolute, flex }), className)}
    />
  );
});

Block.defaultProps = defaultProps;
