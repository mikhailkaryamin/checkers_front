import { DraughtsPlayer } from 'rapid-draughts';
import { beforeEach, describe, expect, it } from 'vitest';
import { Cell } from './index';

describe('Cell', () => {
  let cell: Cell;

  beforeEach(() => {
    cell = new Cell({
      coordinate: { x: 0, y: 0 },
      color: DraughtsPlayer.LIGHT
    });
  });

  it('should create a cell with correct properties', () => {
    expect(cell.color).toBe(DraughtsPlayer.LIGHT);
    expect(cell.coordinate).toEqual({ x: 0, y: 0 });
    expect(cell.selectionType).toBeNull();
    expect(cell.hoverable).toBe(true);
    expect(cell.hovered).toBe(false);
  });

  it('should set selection type', () => {
    cell.setSelectionType('dot');
    expect(cell.selectionType).toBe('dot');
  });

  it('should set hoverable state', () => {
    cell.setHoverable(false);
    expect(cell.hoverable).toBe(false);
  });

  it('should set hovered state', () => {
    cell.setHovered(true);
    expect(cell.hovered).toBe(true);
  });

  it('should get correct chess point for a1', () => {
    // Cell at 0,7 should be a1 in chess notation
    const a1Cell = new Cell({
      coordinate: { x: 0, y: 7 },
      color: DraughtsPlayer.LIGHT
    });
    expect(a1Cell.chessPoint).toEqual({ v: 'a', h: '1' });
    expect(a1Cell.square).toEqual('a1');
  });

  it('should get correct chess point for h8', () => {
    // Cell at 7,0 should be h8 in chess notation
    const h8Cell = new Cell({
      coordinate: { x: 7, y: 0 },
      color: DraughtsPlayer.LIGHT
    });
    expect(h8Cell.chessPoint).toEqual({ v: 'h', h: '8' });
    expect(h8Cell.square).toEqual('h8');
  });
});
