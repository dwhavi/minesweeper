import { describe, test, expect, beforeEach } from 'vitest'
import { createBoard, placeMines, calculateAdjacentMines } from '../src/model/board.js'

describe('createBoard', () => {
  test('creates a 3x3 board with all cells hidden', () => {
    const board = createBoard(3, 3)
    expect(board).toHaveLength(3)
    expect(board[0]).toHaveLength(3)
    board.forEach(row => row.forEach(cell => {
      expect(cell.state).toBe('hidden')
      expect(cell.mine).toBe(false)
      expect(cell.adjacentMines).toBe(0)
    }))
  })
  test('creates a 1x1 board', () => {
    const board = createBoard(1, 1)
    expect(board).toHaveLength(1)
    expect(board[0]).toHaveLength(1)
  })
  test('each cell has correct row and col', () => {
    const board = createBoard(2, 3)
    expect(board[0][0].row).toBe(0)
    expect(board[0][0].col).toBe(0)
    expect(board[1][2].row).toBe(1)
    expect(board[1][2].col).toBe(2)
  })
})

describe('placeMines', () => {
  let board
  beforeEach(() => {
    board = createBoard(3, 3)
  })
  test('places correct number of mines', () => {
    placeMines(board, 3)
    const mineCount = board.flat().filter(c => c.mine).length
    expect(mineCount).toBe(3)
  })
  test('does not place mine on excluded cell', () => {
    placeMines(board, 8, { row: 0, col: 0 })
    expect(board[0][0].mine).toBe(false)
    const mineCount = board.flat().filter(c => c.mine).length
    expect(mineCount).toBe(8)
  })
  test('throws if mine count exceeds available cells', () => {
    expect(() => placeMines(board, 9, { row: 0, col: 0 })).toThrow()
  })
})

describe('calculateAdjacentMines', () => {
  test('calculates adjacent mines correctly', () => {
    const board = createBoard(3, 3)
    board[0][0].mine = true
    board[1][1].mine = true
    calculateAdjacentMines(board)
    expect(board[0][1].adjacentMines).toBe(2)
    expect(board[1][0].adjacentMines).toBe(2)
    expect(board[2][2].adjacentMines).toBe(1)
    expect(board[0][0].adjacentMines).toBe(0) // mine itself, not counted
  })
  test('handles edges correctly (corner cell)', () => {
    const board = createBoard(3, 3)
    board[0][0].mine = true
    calculateAdjacentMines(board)
    expect(board[0][1].adjacentMines).toBe(1)
    expect(board[1][0].adjacentMines).toBe(1)
    expect(board[1][1].adjacentMines).toBe(1)
  })
  test('zero mines results in all zeros', () => {
    const board = createBoard(3, 3)
    calculateAdjacentMines(board)
    board.flat().forEach(cell => {
      expect(cell.adjacentMines).toBe(0)
    })
  })
})
