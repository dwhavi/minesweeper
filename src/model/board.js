// src/model/board.js — Board creation and mine placement
import { CELL_STATE, NEIGHBOR_OFFSETS } from './constants.js';

export function createCell() {
  return {
    state: CELL_STATE.HIDDEN,
    mine: false,
    adjacentMines: 0,
  };
}

export function createBoard(rows, cols) {
  const board = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(createCell());
    }
    board.push(row);
  }
  return board;
}

function getRows(board) {
  return board.length;
}

function getCols(board) {
  return board[0].length;
}

function isNeighborOf(r, c, er, ec) {
  return Math.abs(r - er) <= 1 && Math.abs(c - ec) <= 1;
}

export function placeMines(board, mineCount, excludeRow, excludeCol) {
  const rows = getRows(board);
  const cols = getCols(board);

  // Collect valid positions (not the excluded cell or its neighbors)
  const candidates = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!isNeighborOf(r, c, excludeRow, excludeCol)) {
        candidates.push([r, c]);
      }
    }
  }

  // Fisher-Yates shuffle and pick first mineCount
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const count = Math.min(mineCount, candidates.length);
  for (let i = 0; i < count; i++) {
    const [r, c] = candidates[i];
    board[r][c].mine = true;
  }
}

export function calculateAdjacent(board) {
  const rows = getRows(board);
  const cols = getCols(board);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;

      let count = 0;
      for (const [dr, dc] of NEIGHBOR_OFFSETS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
          count++;
        }
      }
      board[r][c].adjacentMines = count;
    }
  }
}
