import { describe, it, expect } from 'vitest';
import { createBoard, placeMines, calculateAdjacent } from '../src/model/board.js';
import { revealCell, toggleFlag, revealAllMines } from '../src/model/cell.js';
import { CELL_STATE } from '../src/model/constants.js';

function makeBoard(rows, cols, minePositions) {
  const board = createBoard(rows, cols);
  for (const [r, c] of minePositions) {
    board[r][c].mine = true;
  }
  calculateAdjacent(board);
  return board;
}

describe('cell', () => {
  describe('revealCell', () => {
    it('should reveal a hidden cell', () => {
      const board = makeBoard(3, 3, []);
      revealCell(board, 1, 1);
      expect(board[1][1].state).toBe(CELL_STATE.REVEALED);
    });

    it('should not reveal an already revealed cell', () => {
      const board = makeBoard(3, 3, []);
      board[1][1].state = CELL_STATE.REVEALED;
      revealCell(board, 1, 1);
      // still revealed, no crash
      expect(board[1][1].state).toBe(CELL_STATE.REVEALED);
    });

    it('should not reveal a flagged cell', () => {
      const board = makeBoard(3, 3, []);
      board[1][1].state = CELL_STATE.FLAGGED;
      revealCell(board, 1, 1);
      expect(board[1][1].state).toBe(CELL_STATE.FLAGGED);
    });

    it('should flood fill on zero adjacent mines', () => {
      const board = makeBoard(3, 3, [[0, 0]]);
      revealCell(board, 2, 2);
      // (2,2) has 0 adjacent -> flood fill reveals neighbors
      expect(board[2][2].state).toBe(CELL_STATE.REVEALED);
      expect(board[1][2].state).toBe(CELL_STATE.REVEALED);
      expect(board[2][1].state).toBe(CELL_STATE.REVEALED);
      expect(board[1][1].state).toBe(CELL_STATE.REVEALED);
    });

    it('should stop flood fill at numbered cells', () => {
      const board = makeBoard(3, 3, [[0, 0]]);
      revealCell(board, 2, 2);
      // (1,0) is adjacent to mine at (0,0) so it has adjacentMines=1, revealed but not flood-filled further
      expect(board[1][0].state).toBe(CELL_STATE.REVEALED);
      // (0,0) is a mine, should not be revealed by flood fill
      expect(board[0][0].state).toBe(CELL_STATE.HIDDEN);
    });

    it('should return true if a mine is revealed', () => {
      const board = makeBoard(3, 3, [[1, 1]]);
      const result = revealCell(board, 1, 1);
      expect(result).toBe(true);
    });

    it('should return false if no mine is revealed', () => {
      const board = makeBoard(3, 3, []);
      const result = revealCell(board, 1, 1);
      expect(result).toBe(false);
    });
  });

  describe('toggleFlag', () => {
    it('should flag a hidden cell', () => {
      const board = makeBoard(3, 3, []);
      toggleFlag(board, 1, 1);
      expect(board[1][1].state).toBe(CELL_STATE.FLAGGED);
    });

    it('should unflag a flagged cell', () => {
      const board = makeBoard(3, 3, []);
      board[1][1].state = CELL_STATE.FLAGGED;
      toggleFlag(board, 1, 1);
      expect(board[1][1].state).toBe(CELL_STATE.HIDDEN);
    });

    it('should not flag a revealed cell', () => {
      const board = makeBoard(3, 3, []);
      board[1][1].state = CELL_STATE.REVEALED;
      toggleFlag(board, 1, 1);
      expect(board[1][1].state).toBe(CELL_STATE.REVEALED);
    });
  });

  describe('revealAllMines', () => {
    it('should reveal all mine cells', () => {
      const board = makeBoard(3, 3, [[0, 0], [2, 2]]);
      revealAllMines(board);
      expect(board[0][0].state).toBe(CELL_STATE.MINE);
      expect(board[2][2].state).toBe(CELL_STATE.MINE);
    });

    it('should not affect non-mine cells', () => {
      const board = makeBoard(3, 3, [[0, 0]]);
      board[1][1].state = CELL_STATE.FLAGGED;
      revealAllMines(board);
      expect(board[1][1].state).toBe(CELL_STATE.FLAGGED);
      expect(board[2][2].state).toBe(CELL_STATE.HIDDEN);
    });
  });
});
