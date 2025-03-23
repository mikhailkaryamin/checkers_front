import { flatten, map, range } from 'lodash';
import { action, makeAutoObservable, observable } from 'mobx';
import { DraughtsPlayer } from 'rapid-draughts';
import { ChessSkinType } from 'src/components/Battle/types';
import { checkIfNumberEven } from 'src/shared/helpers/checkIfNumberEven';
import { Side } from 'src/types';
import { horizontalSigns, verticalSigns } from '../../constants';
import { Cell } from '../Cell';
import { Sign } from '../Sign';
import { Slot } from '../Slot/index';

export class Board {
  public readonly cells = this._createCells();

  public readonly signs = this._createSigns();

  @observable
  protected _side: Side = DraughtsPlayer.LIGHT;

  @observable
  protected _skinType: ChessSkinType = ChessSkinType.Default;

  public constructor() {
    makeAutoObservable(this);
  }

  public get side() {
    return this._side;
  }

  public get cellSlots() {
    return map(this.cells, 'slot');
  }

  public get skinType() {
    return this._skinType;
  }

  public get playerColor() {
    return this.side;
  }

  public get enemyColor() {
    return this.side === DraughtsPlayer.LIGHT ? DraughtsPlayer.DARK : DraughtsPlayer.LIGHT;
  }

  @action.bound
  public disableCells() {
    this.cells.forEach((cell) => cell.clicker.disable());
  }

  @action.bound
  public getCellBySlot(slot: Slot) {
    const cell = this.cells.find((cell) => cell.slot === slot);
    if (!cell) throw new Error(`Can not find cell by slot ${slot}`);
    return cell;
  }

  @action.bound
  public getSlotBySquare(square: string) {
    const cell = this.getCellBySquare(square);
    return cell.slot;
  }

  @action.bound
  public getCellBySquare (square: string) {
    const cell = this.cells.find((cell) => cell.square === square);
    if (!cell) throw new Error(`Can not find cell by square ${square}`);
    return cell;
  };

  @action.bound
  public getCellByCoordinate(coor: {x: number, y: number}) {
    const cell = this.cells.find((cell) => cell.coordinate.x === coor.x && cell.coordinate.y === coor.y);
    if (!cell) throw new Error(`Can not find cell by square x: ${coor.x} y: ${coor.y}`);
    return cell;
  };

  @action.bound
  public setSide(side: Side) {
    this._side = side;
  }

  @action.bound
  public setSkinType(skinType: ChessSkinType) {
    this._skinType = skinType;
  }

  public async animateResetAllCellsSelectionType() {
    await Promise.all(this.cells.map((cell) => cell.animateSelectionType(null)));
  }

  @action.bound
  protected _createCells() {
    const numberOfCells = 64;
    const numberOfCellsInRow = 8;

    return range(numberOfCells).map((index) => {
      const columnIndex = index % numberOfCellsInRow;
      const rowIndex = Math.floor(index / numberOfCellsInRow);
      let color: Side = checkIfNumberEven(index) ? DraughtsPlayer.LIGHT : DraughtsPlayer.DARK;

      if (!checkIfNumberEven(rowIndex)) {
        color = checkIfNumberEven(index) ? DraughtsPlayer.DARK : DraughtsPlayer.LIGHT;
      }

      const cell = new Cell({
        coordinate: { x: columnIndex, y: rowIndex },
        color,
      });

      return cell;
    });
  }

  @action.bound
  protected _createSigns() {
    return [
      ...flatten(
        horizontalSigns.map(
          (value, index) => new Sign({ value, direction: 'horizontal', index }),
        ),
      ),
      ...flatten(
        verticalSigns.map(
          (value, index) => new Sign({ value, direction: 'vertical', index }),
        ),
      ),
    ];
  }
}
