/**
 * board.js — 보드 생성, 지뢰 배치, 주변 지뢰 수 계산
 */

/**
 * rows x cols 크기의 빈 보드를 생성합니다.
 * @param {number} rows
 * @param {number} cols
 * @returns {Array<Array<object>>} 2D 배열 (각 셀: { state, mine, adjacentMines, row, col })
 */
export function createBoard(rows, cols) {
  const board = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < cols; c++) {
      row.push({
        state: 'hidden',
        mine: false,
        adjacentMines: 0,
        row: r,
        col: c,
      })
    }
    board.push(row)
  }
  return board
}

/**
 * Fisher-Yates shuffle로 무작위 지뢰를 배치합니다.
 * @param {Array<Array<object>>} board
 * @param {number} mineCount
 * @param {object|null} excludeCell - 지뢰를 배치하지 않을 셀 { row, col }
 */
export function placeMines(board, mineCount, excludeCell = null) {
  const rows = board.length
  const cols = board[0].length
  const totalCells = rows * cols
  const availableCells = excludeCell ? totalCells - 1 : totalCells

  if (mineCount > availableCells) {
    throw new Error(`Cannot place ${mineCount} mines: only ${availableCells} cells available`)
  }

  // 모든 셀 인덱스를 수집
  const indices = []
  for (let i = 0; i < totalCells; i++) {
    const r = Math.floor(i / cols)
    const c = i % cols
    if (excludeCell && excludeCell.row === r && excludeCell.col === c) continue
    indices.push(i)
  }

  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }

  // 앞에서 mineCount개를 지뢰로 설정
  for (let i = 0; i < mineCount; i++) {
    const idx = indices[i]
    const r = Math.floor(idx / cols)
    const c = idx % cols
    board[r][c].mine = true
  }
}

/**
 * 각 셀의 8방향 이웃 중 지뢰 개수를 adjacentMines에 저장합니다.
 * 지뢰 셀 자체는 adjacentMines = 0으로 유지합니다.
 * @param {Array<Array<object>>} board
 */
export function calculateAdjacentMines(board) {
  const rows = board.length
  const cols = board[0].length
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ]

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) {
        board[r][c].adjacentMines = 0
        continue
      }

      let count = 0
      for (const [dr, dc] of directions) {
        const nr = r + dr
        const nc = c + dc
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
          count++
        }
      }
      board[r][c].adjacentMines = count
    }
  }
}
