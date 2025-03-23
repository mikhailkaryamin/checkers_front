import { Chess } from 'src/components/Chess/store/Chess';
import { Background } from '../Background';
import { Timer } from '../Timer';
import { Options, ToggleParams } from './types';

export class ViewUpdater {
  protected _chess: Chess;

  protected _timer: Timer;

  protected _background: Background;

  public constructor(options: Options) {
    this._chess = options.chess;
    this._timer = options.timer;
    this._background = options.background;
  }

  public toggle(params: ToggleParams) {
    const { skinType, side } = params;

    if (skinType === null || side === null) {
      return;
    }

    this._chess.board.setSkinType(skinType);
    this._chess.board.setSide(side);
    this._background.setType(skinType);
    this._timer.setSkinType(skinType);

    this._chess.pieces.init();

    if (this._chess.pieces.all.length === 0) {
      // this._chess.pieces.init(piecesData);
    } else {
      this._chess.pieces.getChessPieces().forEach((piece, i) => {
        // const pieceData = piecesData[i];
        // piece.setSkinType(skinType);
        // piece.setPieceColor(pieceData.pieceColor);
        // if (piece.pieceType === 'k') {
        //   piece.setAnimationDataKing(piece.pieceColor);
        // }
      });
    }
  }
}
