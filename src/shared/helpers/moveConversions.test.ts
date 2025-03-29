import { describe, expect, it } from 'vitest';
import { convertMove1DToSquare } from './convertMove1DToSquare';
import { convertSquareToMove1D } from './convertSquareToMove1D';

describe('Move conversion utilities', () => {
  describe('convertMove1DToSquare', () => {
    it('should convert index 0 to b8', () => {
      expect(convertMove1DToSquare(0)).toBe('b8');
    });

    it('should convert index 31 to g1', () => {
      expect(convertMove1DToSquare(31)).toBe('g1');
    });
  });

  describe('convertSquareToMove1D', () => {
    it('should convert b8 to index 0', () => {
      expect(convertSquareToMove1D('b8')).toBe(0);
    });

    it('should convert h1 to index 31', () => {
      expect(convertSquareToMove1D('h1')).toBe(31);
    });
  });

  it('should maintain consistency between conversions', () => {
    // Тестируем преобразование туда и обратно для нескольких индексов
    const indices = [0, 4, 10, 15, 20, 31];

    indices.forEach(index => {
      const square = convertMove1DToSquare(index);
      expect(convertSquareToMove1D(square)).toBe(index);
    });
  });
});
