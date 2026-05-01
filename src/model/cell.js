// src/model/cell.js — Cell reveal, flag, and flood fill
import { CELL_STATE, NEIGHBOR_OFFSETS } from './constants.js';

function getRows(board) {
  return board.length;
}

function getCols(board) {
  return board[0].length;
}

export function revealCell(board, row, col) {
  const rows = getRows(board);
  const cols = getCols(board);

  if (row < 0 || row >= rows || col < 0 || col >= cols) return false;

  const cell = board[row][col];

  // Cannot reveal flagged or already revealed cells
  if (cell.state === CELL_STATE.FLAGGED || cell.state === CELL_STATE.REVEALED) {
    return false;
  }

  // If it's a mine, reveal it and signal game over
  if (cell.mine) {
    cell.state = CELL_STATE.MINE;
    return true;
  }

  // Reveal this cell
  cell.state = CELL_STATE.REVEALED;

  // Flood fill if zero adjacent mines
  if (cell.adjacentMines === 0) {
    for (const [dr, dc] of NEIGHBOR_OFFSETS) {
      const nr = row + dr;
      const nc = col + dc;
      revealCell(board, nr, nc);
    }
  }

  return false;
}

export function toggleFlag(board, row, col) {
  const cell = board[row][col];

  if (cell.state === CELL_STATE.HIDDEN) {
    cell.state = CELL_STATE.FLAGGED;
  } else if (cell.state === CELL_STATE.FLAGGED) {
    cell.state = CELL_STATE.HIDDEN;
  }
  // Revealed and mine cells are not affected
}

export function revealAllMines(board) {
  for (const row of board) {
    for (const cell of row) {
      if (cell.mine) {
        cell.state = CELL_STATE.MINE;
      }
    }
  }
}
