import { flatten, range } from 'lodash';
import { action, makeAutoObservable, observable } from 'mobx';
import { checkIfNumberEven } from 'src/shared/helpers/checkIfNumberEven';
import { Side } from 'src/types';
import { horizontalSigns, verticalSigns } from '../../constants';
import { Cell } from '../Cell';
import { Color } from '../Cell/types';
import { Sign } from '../Sign';

export class Board {
  public readonly cells = this._createCells();

  public readonly signs = this._createSigns();

  @observable
  protected _side: Side = 'w';

  public constructor() {
    makeAutoObservable(this);
  }

  public get side() {
    return this._side;
  }

  public get skinType() {
    return 'blackAndWhite';
  }

  @action.bound
  protected _createCells() {
    const numberOfCells = 64;
    const numberOfCellsInRow = 8;

    return range(numberOfCells).map((index) => {
      const columnIndex = index % numberOfCellsInRow;
      const rowIndex = Math.floor(index / numberOfCellsInRow);
      let color: Color = checkIfNumberEven(index) ? 'w' : 'b';

      if (!checkIfNumberEven(rowIndex)) {
        color = checkIfNumberEven(index) ? 'b' : 'w';
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
