import { CELL_STATE } from '../constants.js'

function getNeighbors(row, col, rows, cols) {
  const neighbors = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = row + dr
      const nc = col + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push({ row: nr, col: nc })
      }
    }
  }
  return neighbors
}

export function revealCell(board, pos) {
  const { row, col } = pos
  const rows = board.length
  const cols = board[0].length
  const cell = board[row][col]

  if (cell.state === CELL_STATE.REVEALED || cell.state === CELL_STATE.FLAGGED) {
    return []
  }

  cell.state = CELL_STATE.REVEALED

  if (cell.adjacentMines > 0 || cell.mine) {
    return [cell]
  }

  // BFS flood fill for empty cells
  const queue = [pos]
  const revealed = [cell]

  while (queue.length > 0) {
    const current = queue.shift()
    const neighbors = getNeighbors(current.row, current.col, rows, cols)

    for (const n of neighbors) {
      const neighbor = board[n.row][n.col]
      if (neighbor.state === CELL_STATE.HIDDEN) {
        neighbor.state = CELL_STATE.REVEALED
        revealed.push(neighbor)
        if (neighbor.adjacentMines === 0 && !neighbor.mine) {
          queue.push(n)
        }
      }
    }
  }

  return revealed
}

export function toggleFlag(board, pos) {
  const cell = board[pos.row][pos.col]

  if (cell.state === CELL_STATE.HIDDEN) {
    cell.state = CELL_STATE.FLAGGED
    return true
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    cell.state = CELL_STATE.HIDDEN
    return false
  }

  // REVEALED — no change
  return false
}
