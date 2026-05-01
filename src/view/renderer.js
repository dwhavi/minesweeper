// src/view/renderer.js — DOM rendering for the game board
import { CELL_STATE, NUMBER_COLORS, GAME_STATE, DIFFICULTY } from '../model/constants.js';

const FACE_MAP = {
  [GAME_STATE.IDLE]: '😊',
  [GAME_STATE.PLAYING]: '😊',
  [GAME_STATE.WON]: '😎',
  [GAME_STATE.LOST]: '💀',
};

export function renderBoard(board, boardEl) {
  boardEl.innerHTML = '';
  const rows = board.length;
  const cols = board[0].length;

  boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  boardEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  // Add difficulty class for adaptive sizing
  boardEl.classList.remove('beginner', 'intermediate', 'expert');
  if (cols <= 9) boardEl.classList.add('beginner');
  else if (cols <= 16) boardEl.classList.add('intermediate');
  else boardEl.classList.add('expert');

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'hidden');
      cellEl.dataset.row = r;
      cellEl.dataset.col = c;
      boardEl.appendChild(cellEl);
      updateCell(board[r][c], cellEl);
    }
  }
}

export function updateCell(cell, cellEl) {
  // Reset classes
  cellEl.className = 'cell';
  cellEl.textContent = '';
  cellEl.style.color = '';

  switch (cell.state) {
    case CELL_STATE.HIDDEN:
      cellEl.classList.add('hidden');
      break;

    case CELL_STATE.FLAGGED:
      cellEl.classList.add('flagged');
      cellEl.textContent = '🚩';
      break;

    case CELL_STATE.MINE:
      cellEl.classList.add('mine');
      cellEl.textContent = '💣';
      break;

    case CELL_STATE.REVEALED:
      cellEl.classList.add('revealed');
      if (cell.adjacentMines > 0) {
        cellEl.textContent = cell.adjacentMines;
        cellEl.classList.add(`n${cell.adjacentMines}`);
        cellEl.style.color = NUMBER_COLORS[cell.adjacentMines] || '#333';
      }
      break;
  }
}

export function updateGameInfo(game, mineCountEl, timerEl, resetBtn) {
  // Mine counter: total mines - flags placed
  const totalMines = DIFFICULTY[game.difficulty].mines;
  const remaining = totalMines - game.flagCount;
  mineCountEl.textContent = String(Math.max(remaining, 0)).padStart(3, '0');

  // Timer
  timerEl.textContent = String(Math.min(game.timer, 999)).padStart(3, '0');

  // Face button
  resetBtn.textContent = FACE_MAP[game.state] || '😊';
}
