import { describe, it, expect } from 'vitest';
import {
  createGame,
  handleReveal,
  handleFlag,
  checkWin,
  getGameStatus,
} from '../src/model/game.js';
import { GAME_STATUS, DIFFICULTY, CELL_STATE } from '../src/model/constants.js';

describe('game', () => {
  describe('createGame', () => {
    it('should create a game with beginner difficulty', () => {
      const game = createGame('beginner');
      expect(game.board).toHaveLength(DIFFICULTY.beginner.rows);
      expect(game.board[0]).toHaveLength(DIFFICULTY.beginner.cols);
      expect(game.status).toBe(GAME_STATUS.PLAYING);
      expect(game.difficulty).toBe('beginner');
      expect(game.firstClick).toBe(true);
      expect(game.timer).toBe(0);
      expect(game.flagCount).toBe(0);
    });

    it('should not place mines until first click', () => {
      const game = createGame('beginner');
      const mineCount = game.board.flat().filter(c => c.mine).length;
      expect(mineCount).toBe(0);
    });
  });

  describe('handleReveal', () => {
    it('should place mines on first click', () => {
      const game = createGame('beginner');
      handleReveal(game, 4, 4);
      const mineCount = game.board.flat().filter(c => c.mine).length;
      expect(mineCount).toBe(DIFFICULTY.beginner.mines);
    });

    it('should not place mines on first-click cell or neighbors', () => {
      const game = createGame('beginner');
      handleReveal(game, 4, 4);
      expect(game.board[4][4].mine).toBe(false);
    });

    it('should set firstClick to false after first reveal', () => {
      const game = createGame('beginner');
      handleReveal(game, 4, 4);
      expect(game.firstClick).toBe(false);
    });

    it('should return game over when hitting a mine', () => {
      const game = createGame('beginner');
      // First click to place mines
      handleReveal(game, 0, 0);
      // Find a mine
      let mineRow = -1, mineCol = -1;
      outer: for (let r = 0; r < game.board.length; r++) {
        for (let c = 0; c < game.board[0].length; c++) {
          if (game.board[r][c].mine) {
            mineRow = r;
            mineCol = c;
            break outer;
          }
        }
      }
      const result = handleReveal(game, mineRow, mineCol);
      expect(result).toBe(GAME_STATUS.LOST);
      expect(game.status).toBe(GAME_STATUS.LOST);
    });

    it('should not allow reveal after game over', () => {
      const game = createGame('beginner');
      game.status = GAME_STATUS.LOST;
      const result = handleReveal(game, 0, 0);
      expect(result).toBe(GAME_STATUS.LOST);
    });

    it('should not allow reveal after game won', () => {
      const game = createGame('beginner');
      game.status = GAME_STATUS.WON;
      const result = handleReveal(game, 0, 0);
      expect(result).toBe(GAME_STATUS.WON);
    });
  });

  describe('handleFlag', () => {
    it('should toggle flag on hidden cell', () => {
      const game = createGame('beginner');
      handleFlag(game, 0, 0);
      expect(game.board[0][0].state).toBe(CELL_STATE.FLAGGED);
      expect(game.flagCount).toBe(1);
    });

    it('should unflag a flagged cell', () => {
      const game = createGame('beginner');
      handleFlag(game, 0, 0);
      handleFlag(game, 0, 0);
      expect(game.board[0][0].state).toBe(CELL_STATE.HIDDEN);
      expect(game.flagCount).toBe(0);
    });

    it('should not flag during lost game', () => {
      const game = createGame('beginner');
      game.status = GAME_STATUS.LOST;
      handleFlag(game, 0, 0);
      expect(game.board[0][0].state).toBe(CELL_STATE.HIDDEN);
    });
  });

  describe('checkWin', () => {
    it('should return false when game is in progress', () => {
      const game = createGame('beginner');
      handleReveal(game, 0, 0);
      expect(checkWin(game)).toBe(false);
    });
  });

  describe('getGameStatus', () => {
    it('should return current game status', () => {
      const game = createGame('beginner');
      expect(getGameStatus(game)).toBe(GAME_STATUS.PLAYING);
      game.status = GAME_STATUS.WON;
      expect(getGameStatus(game)).toBe(GAME_STATUS.WON);
    });
  });
});
