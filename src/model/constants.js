// src/model/constants.js — Game constants and presets

export const DIFFICULTY = Object.freeze({
  beginner: Object.freeze({ rows: 9, cols: 9, mines: 10 }),
  intermediate: Object.freeze({ rows: 16, cols: 16, mines: 40 }),
  expert: Object.freeze({ rows: 16, cols: 30, mines: 99 }),
});

export const CELL_STATE = Object.freeze({
  HIDDEN: 'hidden',
  REVEALED: 'revealed',
  FLAGGED: 'flagged',
  MINE: 'mine',
});

export const GAME_STATE = Object.freeze({
  IDLE: 'idle',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
});

// Backward-compatible alias
export const GAME_STATUS = GAME_STATE;

// 8-directional neighbor offsets
export const NEIGHBOR_OFFSETS = Object.freeze([
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
]);

// Number colors for cell display (1–8)
export const NUMBER_COLORS = Object.freeze({
  1: '#2980b9',  // blue
  2: '#27ae60',  // green
  3: '#e74c3c',  // red
  4: '#6c3483',  // purple
  5: '#922b21',  // maroon
  6: '#148f77',  // teal
  7: '#1c1c1c',  // black
  8: '#7f8c8d',  // gray
});
