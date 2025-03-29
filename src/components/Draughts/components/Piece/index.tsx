import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Block } from 'src/components/Block';
import { Plate } from 'src/components/Board/components/Plate';
import { Fade } from 'src/components/Fade';
import draughtsStyles from '../../index.module.scss';
import CrownSVG from './images/crown.svg?react';
import { Props } from './types';

export const Piece = observer(function Piece(props: Props) {
  const { model, children, ...otherProps } = props;

  return (
    <Plate
      {...otherProps}
      className={cn(
        draughtsStyles.piece,
        (model.isAnimating || model.isDragging) && draughtsStyles.piece_isMoving,
        model.isRotated && draughtsStyles.piece_isRotated,
        model.isHovered && draughtsStyles.piece_isHovered,
        model.isHoverable && draughtsStyles.piece_isHoverable,
      )}
      model={model.plate}
      onClick={model.clicker.click}
      data-testid={`${model.isHoverable ? "piece_isHoverable" : ""}`}
    >
      <Block className={draughtsStyles.pieceHover} fullSize>
        <Block className={draughtsStyles.pieceInner} fullSize>
          <Fade model={model.fade} fullSize>
            <Block className={cn(
              draughtsStyles.pieceFigure,
              model.isLight && draughtsStyles.pieceFigure_light,
              model.isDark && draughtsStyles.pieceFigure_dark,
            )} />
            {model.isKing && <CrownSVG className={draughtsStyles.king} />}
          </Fade>
        </Block>
      </Block>
    </Plate>
  );
});
