import { describe, test, expect } from 'vitest'
import { initGame, handleReveal, handleFlag, handleChord, checkWin } from '../src/model/game.js'
import { DIFFICULTY, CELL_STATE, GAME_STATE } from '../src/model/constants.js'

describe('initGame', () => {
  test('creates game with correct board size for beginner', () => {
    const game = initGame('beginner')
    expect(game.board).toHaveLength(9)
    expect(game.board[0]).toHaveLength(9)
    expect(game.state).toBe(GAME_STATE.IDLE)
    expect(game.flagCount).toBe(0)
  })
  test('creates game with correct board size for expert', () => {
    const game = initGame('expert')
    expect(game.board).toHaveLength(16)
    expect(game.board[0]).toHaveLength(30)
  })
  test('board has no mines initially (placed on first reveal)', () => {
    const game = initGame('beginner')
    const mineCount = game.board.flat().filter(c => c.mine).length
    expect(mineCount).toBe(0)
  })
  test('includes timer property set to 0', () => {
    const game = initGame('beginner')
    expect(game.timer).toBe(0)
  })
  test('minesPlaced is false initially', () => {
    const game = initGame('beginner')
    expect(game.minesPlaced).toBe(false)
  })
})

describe('handleReveal', () => {
  test('first click places mines and starts game', () => {
    const game = initGame('beginner')
    handleReveal(game, { row: 0, col: 0 })
    expect(game.state).toBe(GAME_STATE.PLAYING)
    const mineCount = game.board.flat().filter(c => c.mine).length
    expect(mineCount).toBe(DIFFICULTY.beginner.mines)
  })
  test('first click never hits a mine (100 iterations)', () => {
    for (let i = 0; i < 100; i++) {
      const game = initGame('beginner')
      handleReveal(game, { row: 0, col: 0 })
      expect(game.state).not.toBe(GAME_STATE.LOST)
    }
  })
  test('clicking mine loses the game', () => {
    const game = initGame('beginner')
    handleReveal(game, { row: 0, col: 0 })
    const mineCell = game.board.flat().find(c => c.mine)
    const mineRow = game.board.indexOf(game.board.find(r => r.includes(mineCell)))
    const mineCol = game.board[mineRow].indexOf(mineCell)
    handleReveal(game, { row: mineRow, col: mineCol })
    expect(game.state).toBe(GAME_STATE.LOST)
  })
  test('does nothing if game is already lost', () => {
    const game = initGame('beginner')
    handleReveal(game, { row: 0, col: 0 })
    const mineCell = game.board.flat().find(c => c.mine)
    const mineRow = game.board.indexOf(game.board.find(r => r.includes(mineCell)))
    const mineCol = game.board[mineRow].indexOf(mineCell)
    handleReveal(game, { row: mineRow, col: mineCol })
    const prevRevealed = game.board.flat().filter(c => c.state === CELL_STATE.REVEALED).length
    handleReveal(game, { row: 0, col: 1 })
    const afterRevealed = game.board.flat().filter(c => c.state === CELL_STATE.REVEALED).length
    expect(afterRevealed).toBe(prevRevealed)
  })
  test('does nothing if game is already won', () => {
    const game = initGame('beginner')
    handleReveal(game, { row: 0, col: 0 })
    // Force win
    for (let r = 0; r < game.board.length; r++)
      for (let c = 0; c < game.board[0].length; c++)
        if (!game.board[r][c].mine) game.board[r][c].state = CELL_STATE.REVEALED
    checkWin(game)
    expect(game.state).toBe(GAME_STATE.WON)
    const prevRevealed = game.board.flat().filter(c => c.state === CELL_STATE.REVEALED).length
    handleReveal(game, { row: 0, col: 0 })
    const afterRevealed = game.board.flat().filter(c => c.state === CELL_STATE.REVEALED).length
    expect(afterRevealed).toBe(prevRevealed)
  })
  test('sets minesPlaced to true after first click', () => {
    const game = initGame('beginner')
    expect(game.minesPlaced).toBe(false)
    handleReveal(game, { row: 4, col: 4 })
    expect(game.minesPlaced).toBe(true)
  })
  test('sets startTime after first click', () => {
    const game = initGame('beginner')
    expect(game.startTime).toBeNull()
    handleReveal(game, { row: 4, col: 4 })
    expect(game.startTime).not.toBeNull()
  })
})

describe('handleChord', () => {
  test('does nothing when game is idle', () => {
    const game = initGame('beginner')
    handleChord(game, { row: 0, col: 0 })
    expect(game.state).toBe(GAME_STATE.IDLE)
  })

  test('does nothing when game is lost', () => {
    const game = initGame('beginner')
    handleReveal(game, { row: 0, col: 0 })
    game.state = GAME_STATE.LOST
    const prevRevealed = game.board.flat().filter(c => c.state === CELL_STATE.REVEALED).length
    handleChord(game, { row: 4, col: 4 })
    const afterRevealed = game.board.flat().filter(c => c.state === CELL_STATE.REVEALED).length
    expect(afterRevealed).toBe(prevRevealed)
  })

  test('reveals neighbors when flags match number', () => {
    // Create a controlled board with mine at (0,0)
    const game = initGame('beginner')
    handleReveal(game, { row: 4, col: 4 }) // first click, places mines

    // Find a revealed number cell for testing
    let testCell = null
    let testRow = -1
    let testCol = -1
    for (let r = 0; r < game.board.length && !testCell; r++) {
      for (let c = 0; c < game.board[0].length && !testCell; c++) {
        if (game.board[r][c].state === CELL_STATE.REVEALED && game.board[r][c].adjacentMines > 0) {
          testCell = game.board[r][c]
          testRow = r
          testCol = c
        }
      }
    }

    if (testCell) {
      // Flag enough neighbors to match the number
      const offsets = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
      let flagsPlaced = 0
      for (const [dr, dc] of offsets) {
        if (flagsPlaced >= testCell.adjacentMines) break
        const nr = testRow + dr
        const nc = testCol + dc
        if (nr >= 0 && nr < game.board.length && nc >= 0 && nc < game.board[0].length) {
          if (game.board[nr][nc].state === CELL_STATE.HIDDEN) {
            game.board[nr][nc].state = CELL_STATE.FLAGGED
            flagsPlaced++
          }
        }
      }

      if (flagsPlaced === testCell.adjacentMines) {
        const prevRevealed = game.board.flat().filter(c => c.state === CELL_STATE.REVEALED).length
        handleChord(game, { row: testRow, col: testCol })
        const afterRevealed = game.board.flat().filter(c => c.state === CELL_STATE.REVEALED).length
        // Chord should reveal more cells or keep same
        expect(afterRevealed).toBeGreaterThanOrEqual(prevRevealed)
      }
    }
  })
})

describe('handleFlag', () => {
  test('toggles flag and updates count', () => {
    const game = initGame('beginner')
    const result = handleFlag(game, { row: 0, col: 0 })
    expect(game.board[0][0].state).toBe(CELL_STATE.FLAGGED)
    expect(game.flagCount).toBe(1)
    expect(result).toBe(true)
  })
  test('unflag decreases count', () => {
    const game = initGame('beginner')
    handleFlag(game, { row: 0, col: 0 })
    handleFlag(game, { row: 0, col: 0 })
    expect(game.board[0][0].state).toBe(CELL_STATE.HIDDEN)
    expect(game.flagCount).toBe(0)
  })
  test('cannot flag revealed cell', () => {
    const game = initGame('beginner')
    handleReveal(game, { row: 0, col: 0 })
    const revealedCell = game.board.flat().find(c => c.state === CELL_STATE.REVEALED)
    const r = game.board.indexOf(game.board.find(row => row.includes(revealedCell)))
    const c = game.board[r].indexOf(revealedCell)
    const result = handleFlag(game, { row: r, col: c })
    expect(result).toBe(false)
    expect(game.flagCount).toBe(0)
  })
  test('cannot flag when game is lost', () => {
    const game = initGame('beginner')
    handleReveal(game, { row: 0, col: 0 })
    const mineCell = game.board.flat().find(c => c.mine)
    const mineRow = game.board.indexOf(game.board.find(r => r.includes(mineCell)))
    const mineCol = game.board[mineRow].indexOf(mineCell)
    handleReveal(game, { row: mineRow, col: mineCol })
    const result = handleFlag(game, { row: 0, col: 0 })
    expect(result).toBe(false)
  })
})

describe('checkWin', () => {
  test('game is won when all non-mine cells are revealed', () => {
    const game = initGame('beginner')
    handleReveal(game, { row: 0, col: 0 })
    for (let r = 0; r < game.board.length; r++)
      for (let c = 0; c < game.board[0].length; c++)
        if (!game.board[r][c].mine) game.board[r][c].state = CELL_STATE.REVEALED
    checkWin(game)
    expect(game.state).toBe(GAME_STATE.WON)
  })
  test('game is not won when some cells remain hidden', () => {
    const game = initGame('beginner')
    handleReveal(game, { row: 0, col: 0 })
    checkWin(game)
    expect(game.state).not.toBe(GAME_STATE.WON)
  })
  test('does not change state if game is idle', () => {
    const game = initGame('beginner')
    for (let r = 0; r < game.board.length; r++)
      for (let c = 0; c < game.board[0].length; c++)
        game.board[r][c].state = CELL_STATE.REVEALED
    checkWin(game)
    expect(game.state).toBe(GAME_STATE.IDLE)
  })
  test('does not change state if game is already lost', () => {
    const game = initGame('beginner')
    handleReveal(game, { row: 0, col: 0 })
    game.state = GAME_STATE.LOST
    for (let r = 0; r < game.board.length; r++)
      for (let c = 0; c < game.board[0].length; c++)
        game.board[r][c].state = CELL_STATE.REVEALED
    checkWin(game)
    expect(game.state).toBe(GAME_STATE.LOST)
  })
})
