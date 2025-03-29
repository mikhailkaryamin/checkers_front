import { last, sample } from 'lodash';
import { DraughtsMove1D, DraughtsPlayer, DraughtsStatus, } from 'rapid-draughts';
import {
    EnglishDraughtsComputerFactory as ComputerFactory,
    EnglishDraughtsComputer
} from 'rapid-draughts/english';
import { Draughts } from 'src/components/Draughts/store/Draughts';
import { Difficulty } from 'src/components/Draughts/store/Draughts/types';
import { CancellableAction } from 'src/shared/classes/CancellableAction';
import { Deferred } from 'src/shared/classes/Deferred';
import { EventEmitter } from 'src/shared/classes/EventEmitter';
import { Events } from 'src/shared/classes/Events';
import { convertMove1DToSquare } from 'src/shared/helpers/convertMove1DToSquare';
import { convertSquareToMove1D } from 'src/shared/helpers/convertSquareToMove1D';
import { Nullable } from 'src/types';
import { SoundManager } from '../SoundManager';
import { Sound } from '../SoundManager/types';
import { Timer } from '../Timer';
import { EventTypeMap, MoveParams, Options, PointPath } from './types';
import { WaitActionScenario } from './WaitPlayerActionScenario';
import { GameStatus } from './WaitPlayerActionScenario/types';

export class GameScenario extends CancellableAction {
  protected readonly _eventEmitter = new EventEmitter<EventTypeMap>();

  protected readonly _draughts: Draughts;

  protected readonly _timer: Timer;

  protected readonly _soundManager: SoundManager;

  protected readonly _waitPlayerActionScenario: WaitActionScenario;

  protected readonly _gameIterationAction = new CancellableAction({
    run: async () => {
      this._setGameStatus('running');
      if (!this._checkGameOver()) {
        if (this._checkIfPlayersTurn()) {
          this._isInterrupted = false;
          if (this._timer.isConfigured && !this._timer.isLaunched) {
            this._timer.run();
            const moveData = await this._waitPlayerActionScenario.run();
            await this._move(moveData);
            this._timer.pause();
          } else if (this._timer.isConfigured && this._timer.isLaunched) {
            this._timer.resume();
            const moveData = await Promise.race([
              this._waitPlayerActionScenario.run(),
              this._timer.waitWhenRunning(),
            ]);
            this._timer.pause();

            if (moveData) {
              await this._move(moveData);
            }
          } else {
            const moveData = await this._waitPlayerActionScenario.run();
            await this._move(moveData);
          }

          if (this._timer.checkIfTimeOut()) {
            this._setGameStatus('timeOver');
          }
        } else {
          await this._runComputerMove();
        }
      }
    },
    done: () => {
      if (
        !this._checkGameOver() &&
        !this._timer.checkIfTimeOut()
      ) {
        this._gameIterationAction.run();
      } else {
        this._handleGameEnding();
      }
    },
    cancel: () => {
      this._setGameStatus('cancelled');
      this._waitPlayerActionScenario.cancel();
    },
  });

  protected _deferredGameScenario: Nullable<Deferred<void>> = null;

  protected _gameStatus: GameStatus = 'notStarted';

  protected _isHintsEnabled = false;

  protected _isInterrupted = false;

  public constructor(options: Options) {
    super({
      run: () => this._runGameScenario(),
      cancel: () => this._gameIterationAction.cancelSoft(),
    });
    this._draughts = options.draughts;
    this._timer = options.timer;
    this._soundManager = options.soundManager;
    this._waitPlayerActionScenario = new WaitActionScenario({
      draughts: this._draughts
    });
  }

  public get events() {
    return new Events({ eventEmitter: this._eventEmitter });
  }

  public get gameStatus() {
    return this._gameStatus;
  }

  public get isHintsEnabled() {
    return this._isHintsEnabled;
  }

  protected get _draughtsEngine() {
    return this._draughts.engine;
  }

  protected get _moves() {
    return this._draughtsEngine.history.moves;
  }

  protected get _playerColor() {
    return this._draughts.board.side;
  }

  protected get _computerColor() {
    return this._playerColor === DraughtsPlayer.LIGHT ? DraughtsPlayer.DARK : DraughtsPlayer.LIGHT;
  }

  protected get _lastMove() {
    return last(this._moves) ?? null;
  }

  public setIsHintsEnabled(isHintsEnabled: boolean) {
    this._isHintsEnabled = isHintsEnabled;
  }

  protected async _runGameScenario() {
    this._deferredGameScenario = new Deferred();
    this._gameIterationAction.run();
    await this._deferredGameScenario.promise;
  }

  protected async _move(params: MoveParams) {
    const { startSquare, finishSquare } = params;
    const move = this._draughtsEngine.moves.find((m) => (
      m.origin === convertSquareToMove1D(startSquare)
      &&
      m.destination === convertSquareToMove1D(finishSquare)));

    if (move === undefined) {
      throw new Error('Move not found')
    }

    const capturesPath = this._findCapturesPath(move);

    this._draughtsEngine.move(move);
    if (capturesPath.length) {
      const currentPath = capturesPath[0].path;
      for (let i = 0; i < currentPath.length - 1; i++) {
        const currentStep = currentPath[i];
        const nextStep = currentPath[i + 1];

        await this._draughts.pieces.movePieceBySquares({
          startSquare: this._draughts.board.getCellByCoordinate({x: currentStep.x, y: currentStep.y}).square,
          finishSquare: this._draughts.board.getCellByCoordinate({x: nextStep.x, y: nextStep.y}).square,
        });

        this._soundManager.play(Sound.Capture);
      }
    } else {
      this._soundManager.play(this._checkIfPlayersTurn() ? Sound.MoveSelf : Sound.MoveEnemy);

      await this._draughts.pieces.movePieceBySquares({
        startSquare: startSquare,
        finishSquare: finishSquare,
      });
    }

    if (move.captures.length) {
      const capturedPieces = move.captures.map((c) =>
        this._draughts.pieces.getDraughtsPieceBySquare(convertMove1DToSquare(c))
      );
      capturedPieces.forEach((capturedPiece) => {
        this._draughts.pieces.removePiece(capturedPiece);
      })
    }
    this._draughtsEngine.board.forEach((squareData) => {
      if (squareData.piece) {
        const piece = this._draughts.pieces.getDraughtsPieceBySquare(convertMove1DToSquare(squareData.position));
        if (!piece.isKing && squareData.piece?.king) {
          piece.turnToKing()
        }
      }
    })
  }

  protected _findCapturesPath(move: DraughtsMove1D) {
    const startCell = this._draughts.board.getCellBySquare(convertMove1DToSquare(move.origin));
    const start = { x: startCell.coordinate.x, y: startCell.coordinate.y };
    const finishCell = this._draughts.board.getCellBySquare(convertMove1DToSquare(move.destination));
    const finish = { x: finishCell.coordinate.x, y: finishCell.coordinate.y };
    const captures = move.captures.map((c) =>
      this._draughts.board.getCellBySquare(convertMove1DToSquare(c))
    ).map((c) => ({x: c.coordinate.x, y: c.coordinate.y}))

    function isValidCell(p: PointPath): boolean {
      return p.y >= 0 && p.y < 8 && p.x >= 0 && p.x < 8;
    }

    function findCaptureSequences(
      start: PointPath,
      end: PointPath,
      enemyPieces: PointPath[]
    ): { path: PointPath[]; order: PointPath[] }[] {
      const results: { path: PointPath[]; order: PointPath[] }[] = [];
      function dfs(current: PointPath, remaining: PointPath[], path: PointPath[], order: PointPath[]) {
        if (remaining.length === 0) {
          if (current.y === end.y && current.x === end.x) {
            results.push({ path: [...path], order: [...order] });
          }
          return;
        }
        for (let i = 0; i < remaining.length; i++) {
          const enemy = remaining[i];
          const dRow = enemy.y - current.y;
          const dCol = enemy.x - current.x;
          if (Math.abs(dRow) !== 1 || Math.abs(dCol) !== 1) {
            continue;
          }
          const landing: PointPath = { y: enemy.y + dRow, x: enemy.x + dCol };
          if (!isValidCell(landing)) {
            continue;
          }

          const newRemaining = remaining.slice(0, i).concat(remaining.slice(i + 1));
          path.push(landing);
          order.push(enemy);
          dfs(landing, newRemaining, path, order);
          path.pop();
          order.pop();
        }
      }

      dfs(start, enemyPieces, [start], []);
      return results;
    }
    return findCaptureSequences(start, finish, captures)
  }

  protected async _waitComputerBestMove() {
    let computer: EnglishDraughtsComputer;
    if (this._draughts.difficulty === Difficulty.Easy) {
      computer = ComputerFactory.random()
    } else if (this._draughts.difficulty === Difficulty.Medium) {
      computer = ComputerFactory.alphaBeta({
        maxDepth: 3,
      });
    } else {
      computer = ComputerFactory.alphaBeta({
        maxDepth: 7,
      });
    }

    const move = await computer(this._draughtsEngine)
    return {
      startSquare: convertMove1DToSquare(move.origin),
      finishSquare: convertMove1DToSquare(move.destination),
    };
  }

  protected _getRandomMove() {
    const possibleMoves = this._draughtsEngine.moves;
    const randomMove = sample(possibleMoves)!;

    return randomMove;
  }

  protected _checkIfPlayersTurn() {
    return this._draughtsEngine.player === this._playerColor;
  }

  protected async _runComputerMove() {
    const { startSquare, finishSquare } = await this._waitComputerBestMove();
    await this._move({ startSquare, finishSquare });
  }

  protected async _handleGameEnding() {
    const isCurrentPlayerLight = this._playerColor === DraughtsPlayer.LIGHT;
    const isCurrentPlayerDark = this._playerColor === DraughtsPlayer.DARK;

    if (this._draughtsEngine.status === DraughtsStatus.DRAW) {
      this._setGameStatus('draw');
    } else if (isCurrentPlayerLight && this._draughtsEngine.status === DraughtsStatus.LIGHT_WON) {
      this._setGameStatus('playerWin');
    } else if (isCurrentPlayerDark && this._draughtsEngine.status === DraughtsStatus.DARK_WON) {
      this._setGameStatus('playerWin');
    } else {
      this._setGameStatus('playerLoss');
    }

    this._resolveGameScenario();
  }

  protected _setGameStatus(gameStatus: GameStatus) {
    this._gameStatus = gameStatus;
  }

  protected _resolveGameScenario() {
    this._deferredGameScenario?.resolve();
    this._deferredGameScenario = null;
  }

  protected _checkGameOver() {
    return (
      this._draughtsEngine.status !== DraughtsStatus.PLAYING
    );
  }
}
