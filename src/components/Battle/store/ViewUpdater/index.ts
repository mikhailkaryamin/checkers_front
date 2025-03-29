import { Draughts } from 'src/components/Draughts/store/Draughts';
import { Background } from '../Background';
import { Timer } from '../Timer';
import { Options, ToggleParams } from './types';

export class ViewUpdater {
  protected _draughts: Draughts;

  protected _timer: Timer;

  protected _background: Background;

  public constructor(options: Options) {
    this._draughts = options.draughts;
    this._timer = options.timer;
    this._background = options.background;
  }

  public toggle(params: ToggleParams) {
    const { skinType, side } = params;

    if (skinType === null || side === null) {
      return;
    }

    this._draughts.board.setSkinType(skinType);
    this._draughts.board.setSide(side);
    this._background.setType(skinType);
    this._timer.setSkinType(skinType);

    this._draughts.pieces.init();

    if (this._draughts.pieces.all.length === 0) {
      // this._draughts.pieces.init(piecesData);
    } else {
      this._draughts.pieces.getDraughtsPieces().forEach((piece, i) => {
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
