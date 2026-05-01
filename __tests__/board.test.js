import { describe, it, expect } from 'vitest';
import { createBoard, placeMines, calculateAdjacent } from '../src/model/board.js';
import { CELL_STATE } from '../src/model/constants.js';

describe('board', () => {
  describe('createBoard', () => {
    it('should create a 2D array with correct dimensions', () => {
      const board = createBoard(3, 4);
      expect(board).toHaveLength(3);
      expect(board[0]).toHaveLength(4);
    });

    it('should initialize cells with default state', () => {
      const board = createBoard(2, 2);
      const cell = board[0][0];
      expect(cell.state).toBe(CELL_STATE.HIDDEN);
      expect(cell.mine).toBe(false);
      expect(cell.adjacentMines).toBe(0);
    });

    it('should create independent cell objects', () => {
      const board = createBoard(2, 2);
      board[0][0].mine = true;
      expect(board[0][1].mine).toBe(false);
    });
  });

  describe('placeMines', () => {
    it('should place the correct number of mines', () => {
      const board = createBoard(5, 5);
      placeMines(board, 10, 0, 0);
      const mineCount = board.flat().filter(c => c.mine).length;
      expect(mineCount).toBe(10);
    });

    it('should not place a mine on the excluded cell', () => {
      const board = createBoard(5, 5);
      placeMines(board, 10, 2, 2);
      expect(board[2][2].mine).toBe(false);
    });

    it('should not place mines on neighbors of excluded cell', () => {
      const board = createBoard(5, 5);
      placeMines(board, 10, 2, 2);
      for (let r = 1; r <= 3; r++) {
        for (let c = 1; c <= 3; c++) {
          expect(board[r][c].mine).toBe(false);
        }
      }
    });

    it('should handle edge exclusion (corner)', () => {
      const board = createBoard(5, 5);
      placeMines(board, 10, 0, 0);
      expect(board[0][0].mine).toBe(false);
      expect(board[0][1].mine).toBe(false);
      expect(board[1][0].mine).toBe(false);
      expect(board[1][1].mine).toBe(false);
    });
  });

  describe('calculateAdjacent', () => {
    it('should count adjacent mines correctly', () => {
      const board = createBoard(3, 3);
      board[0][0].mine = true;
      board[2][2].mine = true;
      calculateAdjacent(board);
      expect(board[0][1].adjacentMines).toBe(1);
      expect(board[1][1].adjacentMines).toBe(2);
      expect(board[2][1].adjacentMines).toBe(1);
    });

    it('should set 0 for cells with no adjacent mines', () => {
      const board = createBoard(3, 3);
      board[0][0].mine = true;
      calculateAdjacent(board);
      expect(board[2][2].adjacentMines).toBe(0);
    });

    it('should not count the cell itself', () => {
      const board = createBoard(3, 3);
      board[1][1].mine = true;
      calculateAdjacent(board);
      expect(board[1][1].adjacentMines).toBe(0);
    });
  });
});
