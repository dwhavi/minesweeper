export const CELL_STATE = Object.freeze({
  HIDDEN: 'hidden',
  REVEALED: 'revealed',
  FLAGGED: 'flagged',
})

export const GAME_STATE = Object.freeze({
  IDLE: 'idle',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
})

export const DIFFICULTY = Object.freeze({
  beginner: { rows: 9, cols: 9, mines: 10, label: '초급' },
  intermediate: { rows: 16, cols: 16, mines: 40, label: '중급' },
  expert: { rows: 16, cols: 30, mines: 99, label: '고급' },
})
