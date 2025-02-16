import { makeAutoObservable } from "mobx";
import { DraughtsPlayer, DraughtsStatus } from 'rapid-draughts';
import {
  EnglishDraughtsComputerFactory as ComputerFactory,
  EnglishDraughts as Draughts,
  EnglishDraughtsGame
} from 'rapid-draughts/english';
import { RootStore } from "./RootStore";


export enum Player {
  Black = "black",
  White = "white",
}

export interface Piece {
  player: Player;
  isKing: boolean;
}

export type Cell = Piece | null;

export class GameStore {
  rootStore: RootStore;

  draughts: EnglishDraughtsGame;
  board: Cell[][] = [];
  currentPlayer: Player = Player.White; // Игрок (белые) начинают игру
  selectedPiece: { row: number; col: number } | null = null;
  possibleMoves: Array<{ row: number; col: number }> = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    this.draughts = Draughts.setup();
  }

  async init() {

    // Show the available moves and play one.
    // console.table(draughts.moves);
    // draughts.move(draughts.moves[0]);

    // Initialise two computer players
    const weakComputer = ComputerFactory.random();
    const strongComputer = ComputerFactory.alphaBeta({
      maxDepth: 7,
    });

    // Play with the AIs until there is a winner
    while (this.draughts.status === DraughtsStatus.PLAYING) {
      // console.log(`${draughts.asciiBoard()}`);
      // console.log(`to_move = ${draughts.player}`);

      const computerPlayer =
        this.draughts.player === DraughtsPlayer.LIGHT ? weakComputer : strongComputer;

      const move = await computerPlayer(this.draughts);
      if (move) this.draughts.move(move);
    }

    // Announce the winner
    console.log(`${this.draughts.asciiBoard()}`);
    console.log(`status = ${this.draughts.status}`);
    console.log(`ended after ${this.draughts.history.moves.length} moves`);
  }

  initBoard() {
    // Инициализируем пустую доску 8x8
    this.board = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => null)
    );
    // Расставляем шашки на тёмных клетках
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          if (row < 3) {
            this.board[row][col] = { player: Player.Black, isKing: false };
          } else if (row > 4) {
            this.board[row][col] = { player: Player.White, isKing: false };
          }
        }
      }
    }
  }

  selectPiece(row: number, col: number) {
    const piece = this.board[row][col];
    if (piece && piece.player === this.currentPlayer) {
      this.selectedPiece = { row, col };
      this.calculatePossibleMoves(row, col);
    } else {
      this.selectedPiece = null;
      this.possibleMoves = [];
    }
  }

  calculatePossibleMoves(row: number, col: number) {
    this.possibleMoves = this.getValidMoves(row, col);
  }

  getValidMoves(row: number, col: number): Array<{ row: number; col: number }> {
    const moves: Array<{ row: number; col: number }> = [];
    const piece = this.board[row][col];
    if (!piece) return moves;
    const directions: Array<{ row: number; col: number }> = [];
    // Для белых (или дамок) движение вверх, для чёрных – вниз
    if (piece.player === Player.White || piece.isKing) {
      directions.push({ row: -1, col: -1 });
      directions.push({ row: -1, col: 1 });
    }
    if (piece.player === Player.Black || piece.isKing) {
      directions.push({ row: 1, col: -1 });
      directions.push({ row: 1, col: 1 });
    }
    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;
      if (this.isValidCell(newRow, newCol) && !this.board[newRow][newCol]) {
        moves.push({ row: newRow, col: newCol });
      }
    }
    return moves;
  }

  movePiece(toRow: number, toCol: number) {
    if (!this.selectedPiece) return;
    const { row, col } = this.selectedPiece;
    const piece = this.board[row][col];
    if (!piece) return;
    if (this.possibleMoves.find((m) => m.row === toRow && m.col === toCol)) {
      this.board[toRow][toCol] = piece;
      this.board[row][col] = null;
      // Превращение в дамку при достижении противоположной стороны
      if (piece.player === Player.White && toRow === 0) {
        piece.isKing = true;
      }
      if (piece.player === Player.Black && toRow === 7) {
        piece.isKing = true;
      }
      // Смена игрока
      this.currentPlayer = piece.player === Player.White ? Player.Black : Player.White;
      // Если сейчас очередь компьютера (чёрных) – запускаем его ход с задержкой
      if (this.currentPlayer === Player.Black) {
        setTimeout(() => this.moveComputer(), 500);
      }
    }
    this.selectedPiece = null;
    this.possibleMoves = [];
  }

  // Преобразование 8x8 доски в формат движка (32 клеток)
  convertBoardToEngineFormat(): number[] {
    const engineBoard: number[] = [];
    for (let row = 0; row < 8; row++) {
      // На четных строках тёмные клетки – с индексами 1,3,5,7; на нечетных – 0,2,4,6
      const darkCols = row % 2 === 0 ? [1, 3, 5, 7] : [0, 2, 4, 6];
      for (const col of darkCols) {
        const cell = this.board[row][col];
        if (!cell) {
          engineBoard.push(0);
        } else if (cell.player === Player.Black) {
          engineBoard.push(cell.isKing ? 2 : 1);
        } else if (cell.player === Player.White) {
          engineBoard.push(cell.isKing ? 4 : 3);
        }
      }
    }
    return engineBoard;
  }

  // Преобразует индекс из движка (0–31) в координаты 8x8 доски
  engineIndexToCoords(index: number): { row: number; col: number } {
    const row = Math.floor(index / 4);
    const darkCols = row % 2 === 0 ? [1, 3, 5, 7] : [0, 2, 4, 6];
    const col = darkCols[index % 4];
    return { row, col };
  }

  // Ход компьютера с использованием rapid-draughts
  moveComputer() {

  }

  isValidCell(row: number, col: number) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }
}
