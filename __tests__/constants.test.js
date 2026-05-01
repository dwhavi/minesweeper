import { describe, it, expect } from 'vitest';
import {
  DIFFICULTY,
  CELL_STATE,
  GAME_STATE,
} from '../src/model/constants.js';

describe('constants', () => {
  describe('DIFFICULTY', () => {
    it('should have beginner preset', () => {
      expect(DIFFICULTY.beginner).toEqual({ rows: 9, cols: 9, mines: 10 });
    });

    it('should have intermediate preset', () => {
      expect(DIFFICULTY.intermediate).toEqual({ rows: 16, cols: 16, mines: 40 });
    });

    it('should have expert preset', () => {
      expect(DIFFICULTY.expert).toEqual({ rows: 16, cols: 30, mines: 99 });
    });
  });

  describe('CELL_STATE', () => {
    it('should export HIDDEN, REVEALED, FLAGGED, MINE', () => {
      expect(CELL_STATE.HIDDEN).toBe('hidden');
      expect(CELL_STATE.REVEALED).toBe('revealed');
      expect(CELL_STATE.FLAGGED).toBe('flagged');
      expect(CELL_STATE.MINE).toBe('mine');
    });
  });

  describe('GAME_STATE', () => {
    it('should export IDLE, PLAYING, WON, LOST', () => {
      expect(GAME_STATE.IDLE).toBe('idle');
      expect(GAME_STATE.PLAYING).toBe('playing');
      expect(GAME_STATE.WON).toBe('won');
      expect(GAME_STATE.LOST).toBe('lost');
    });
  });
});
