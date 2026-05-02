/**
 * game.js — Game state management, win/loss detection
 */
import { DIFFICULTY, GAME_STATE, CELL_STATE } from './constants.js'
import { createBoard, placeMines, calculateAdjacent } from './board.js'
import { revealCell, toggleFlag, chordReveal } from './cell.js'

/**
 * Initialize a new game. Mines are NOT placed yet.
 * @param {string} difficultyKey - 'beginner' | 'intermediate' | 'expert'
 * @returns {object} game
 */
export function initGame(difficultyKey) {
  const config = DIFFICULTY[difficultyKey]
  if (!config) {
    throw new Error(`Unknown difficulty: ${difficultyKey}`)
  }

  return {
    board: createBoard(config.rows, config.cols),
    state: GAME_STATE.IDLE,
    difficulty: difficultyKey,
    flagCount: 0,
    startTime: null,
    minesPlaced: false,
    timer: 0,
  }
}

/**
 * Handle cell reveal. First click places mines.
 * @param {object} game
 * @param {{ row: number, col: number }} pos
 */
export function handleReveal(game, pos) {
  if (game.state === GAME_STATE.LOST || game.state === GAME_STATE.WON) {
    return
  }

  const { row, col } = pos

  // First click: place mines
  if (game.state === GAME_STATE.IDLE) {
    const config = DIFFICULTY[game.difficulty]
    placeMines(game.board, config.mines, row, col)
    calculateAdjacent(game.board)
    game.state = GAME_STATE.PLAYING
    game.startTime = Date.now()
    game.minesPlaced = true
  }

  // Reveal cell
  const hitMine = revealCell(game.board, row, col)

  if (hitMine) {
    game.state = GAME_STATE.LOST
    return
  }

  // Auto win check
  checkWin(game)
}

/**
 * Handle chord: click on a revealed number cell to auto-reveal neighbors
 * when adjacent flags match the number.
 * @param {object} game
 * @param {{ row: number, col: number }} pos
 */
export function handleChord(game, pos) {
  if (game.state !== GAME_STATE.PLAYING) return

  const { row, col } = pos
  const result = chordReveal(game.board, row, col)

  if (result.hitMine) {
    game.state = GAME_STATE.LOST
    return
  }

  checkWin(game)
}

/**
 * Toggle flag on a cell.
 * @param {object} game
 * @param {{ row: number, col: number }} pos
 * @returns {boolean} true if flag was placed, false if removed or no change
 */
export function handleFlag(game, pos) {
  if (game.state === GAME_STATE.LOST || game.state === GAME_STATE.WON) {
    return false
  }

  const { row, col } = pos
  const cell = game.board[row][col]

  if (cell.state === CELL_STATE.HIDDEN) {
    toggleFlag(game.board, row, col)
    game.flagCount++
    return true
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    toggleFlag(game.board, row, col)
    game.flagCount--
    return false
  }

  return false
}

/**
 * Check if all non-mine cells are revealed. Sets game.state to WON if so.
 * @param {object} game
 */
export function checkWin(game) {
  if (game.state !== GAME_STATE.PLAYING) return

  for (const row of game.board) {
    for (const cell of row) {
      if (!cell.mine && cell.state !== CELL_STATE.REVEALED) {
        return
      }
    }
  }

  game.state = GAME_STATE.WON
}
