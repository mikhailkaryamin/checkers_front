import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { Block } from 'src/components/Block';
import { Plate } from 'src/components/Board/components/Plate';
import { Fade } from 'src/components/Fade';
import chessStyles from '../../index.module.scss';
import CrownSVG from './images/crown.svg?react';
import { Props } from './types';

export const Piece = observer(function Piece(props: Props) {
  const { model, children, ...otherProps } = props;

  return (
    <Plate
      {...otherProps}
      className={cn(
        chessStyles.piece,
        (model.isAnimating || model.isDragging) && chessStyles.piece_isMoving,
        model.isRotated && chessStyles.piece_isRotated,
        model.isHovered && chessStyles.piece_isHovered,
        model.isHoverable && chessStyles.piece_isHoverable,
      )}
      model={model.plate}
      onClick={model.clicker.click}
    >
      <Block className={chessStyles.pieceHover} fullSize>
        <Block className={chessStyles.pieceInner} fullSize>
          <Fade model={model.fade} fullSize>
            <Block className={cn(
              chessStyles.pieceFigure,
              model.isLight && chessStyles.pieceFigure_light,
              model.isDark && chessStyles.pieceFigure_dark,
            )} />
            {model.isKing && <CrownSVG className={chessStyles.king} />}
          </Fade>
        </Block>
      </Block>
    </Plate>
  );
});
