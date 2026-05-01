import { DIFFICULTY, CELL_STATE, GAME_STATE } from '../src/constants.js'

describe('constants', () => {
  test('beginner has correct grid size', () => {
    expect(DIFFICULTY.beginner.rows).toBe(9)
    expect(DIFFICULTY.beginner.cols).toBe(9)
    expect(DIFFICULTY.beginner.mines).toBe(10)
  })
  test('intermediate has correct grid size', () => {
    expect(DIFFICULTY.intermediate.rows).toBe(16)
    expect(DIFFICULTY.intermediate.cols).toBe(16)
    expect(DIFFICULTY.intermediate.mines).toBe(40)
  })
  test('expert has correct grid size', () => {
    expect(DIFFICULTY.expert.rows).toBe(16)
    expect(DIFFICULTY.expert.cols).toBe(30)
    expect(DIFFICULTY.expert.mines).toBe(99)
  })
  test('cell states cover all cases', () => {
    expect(CELL_STATE).toHaveProperty('HIDDEN')
    expect(CELL_STATE).toHaveProperty('REVEALED')
    expect(CELL_STATE).toHaveProperty('FLAGGED')
  })
  test('game states cover all cases', () => {
    expect(GAME_STATE).toHaveProperty('IDLE')
    expect(GAME_STATE).toHaveProperty('PLAYING')
    expect(GAME_STATE).toHaveProperty('WON')
    expect(GAME_STATE).toHaveProperty('LOST')
  })
})
