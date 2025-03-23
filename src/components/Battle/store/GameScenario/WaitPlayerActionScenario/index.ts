import { flatten } from 'lodash';
import { DraughtsPlayer } from 'rapid-draughts';
import { Chess } from 'src/components/Chess/store/Chess';
import { ChessActionWaiter } from 'src/components/Chess/store/ChessActionWaiter';
import { Piece } from 'src/components/Chess/store/Piece';
import { convertMove1DToSquare } from 'src/shared/helpers/convertMove1DToSquare';
import { convertSquareToMove1D } from 'src/shared/helpers/convertSquareToMove1D';
import { Nullable } from 'src/types';
import { Options } from './types';

export class WaitActionScenario {
  protected _isActionDone = false;

  protected readonly _chess: Chess;

  protected readonly _chessActionWaiter: ChessActionWaiter;

  public constructor(options: Options) {
    this._chess = options.chess;
    this._chessActionWaiter = new ChessActionWaiter({ chess: this._chess });
  }

  protected _selectedPiece: Nullable<Piece> = null;

  protected get _draughts() {
    return this._chess.engine;
  }

  protected get _movingSide() {
    return this._draughts.player;
  }

  protected get _movingPieces() {
    return this._chess.pieces
      .getChessPieces()
      .filter((piece) => piece.pieceColor === this._movingSide);
  }

  protected get _enemyPieces() {
    const enemyColor = this._movingSide === DraughtsPlayer.LIGHT
      ? DraughtsPlayer.DARK : DraughtsPlayer.LIGHT;

    return this._chess.pieces
      .getChessPieces()
      .filter((piece) => piece.pieceColor === enemyColor);
  }

  public async run() {
    this._isActionDone = false;
    let startSquare: Nullable<string> = null;
    let finishSquare: Nullable<string> = null;

    while (!this._isActionDone) {
      this._enablePossiblePieces();

      const actionData = await this._chessActionWaiter.wait(this._movingPieces, this._enemyPieces);

      this._disablePossiblePieces();

      if (actionData.type === 'clickPlayerPiece') {
        const prevSelectedPiece = this._selectedPiece;
        this._unselectPiece();
        prevSelectedPiece !== actionData.piece && this._selectPiece(actionData.piece);
      } else if (actionData.type === 'clickCell' && this._selectedPiece) {
        startSquare = this._chess.board.getCellBySlot(this._selectedPiece.plate.slot)
          .square;
        finishSquare = actionData.cell.square;
        this._unselectPiece();
        this._isActionDone = true;
      } else if (actionData.type === 'clickComputerPiece' && this._selectedPiece) {
        startSquare = this._chess.board.getCellBySlot(this._selectedPiece.plate.slot)
          .square;
        finishSquare = this._chess.board.getCellBySlot(actionData.piece.plate.slot)
          .square;
        this._unselectPiece();
        this._isActionDone = true;
      }
    }

    return { startSquare: startSquare!, finishSquare: finishSquare! };
  }

  public cancel() {
    if (this._chess.pieces.all.length !== 0) {
      this._unselectPiece();
      this._disablePossiblePieces();
    }

    this._chessActionWaiter.cancel();
  }

  protected _enablePossiblePieces() {
    const movesData = this._draughts.moves;
    const pieces = movesData.map((move) =>
      this._chess.pieces.getChessPieceBySquare(convertMove1DToSquare(move.origin)));
    const cells = movesData.map((move) =>
      this._chess.board.getCellBySquare(convertMove1DToSquare(move.origin)));
    pieces.forEach((piece) => {
      piece.setIsHoverable(true);
      piece.clicker.enable();
    });
    cells.forEach((cell) => {
      cell.setHoverable(true);
    });
  }

  protected _disablePossiblePieces() {
    const movesData = this._draughts.moves;
    const pieces = movesData.map((move) =>
      this._chess.pieces.getChessPieceBySquare(convertMove1DToSquare(move.origin)));
    const cells = movesData.map((move) =>
      this._chess.board.getCellBySquare(convertMove1DToSquare(move.origin)));
    pieces.forEach((piece) => {
      piece.setIsHoverable(false);
      piece.clicker.disable();
    });
    cells.forEach((cell) => {
      cell.setHoverable(false);
    });
  }

  protected async _selectPiece(piece: Piece) {
    if (this._selectedPiece === piece) return;

    this._selectedPiece = piece;
    const cell = this._chess.board.getCellBySlot(piece.plate.slot);
    const possibleMoves = this._draughts.moves.filter((m) => m.origin === convertSquareToMove1D(cell.square))
    const captures = flatten(possibleMoves.filter((m) => m.captures.length >= 1).map((el) => el.captures));
    const defaultMovesCells = possibleMoves.map((m) =>
      this._chess.board.getCellBySquare(convertMove1DToSquare(m.destination)),
    );
    const capturesCells = captures.map((c) =>
      this._chess.board.getCellBySquare(convertMove1DToSquare(c)),
    );

    defaultMovesCells.forEach((cell) => {
      cell.clicker.enable();
      cell.setHoverable(true);
    });
    await Promise.all([
      defaultMovesCells.map((cell) => cell.animateSelectionType('dot')),
      capturesCells.map((cell) => cell.animateSelectionType('overlap')),
    ]);
  }

  protected async _unselectPiece() {
    if (this._selectedPiece === null) return;

    const cell = this._chess.board.getCellBySlot(this._selectedPiece.plate.slot);
    const possibleMoves = this._draughts.moves.filter((m) => m.origin === convertSquareToMove1D(cell.square))
    const captures = flatten(possibleMoves.filter((m) => m.captures.length >= 1).map((el) => el.captures));
    const defaultMovesCells = possibleMoves.map((m) =>
      this._chess.board.getCellBySquare(convertMove1DToSquare(m.destination)),
    );
    const capturesCells = captures.map((c) =>
      this._chess.board.getCellBySquare(convertMove1DToSquare(c)),
    );
    this._selectedPiece = null;
    defaultMovesCells.forEach((cell) => {
      cell.clicker.disable();
      cell.setHoverable(false);
    });
    await Promise.all([
      defaultMovesCells.map((cell) => cell.animateSelectionType(null)),
      capturesCells.map((cell) => cell.animateSelectionType(null)),
    ]);
  }

}
