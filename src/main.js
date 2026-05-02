// src/main.js — Minesweeper entry point
import { initGame, handleReveal, handleFlag, handleChord } from './model/game.js';
import { GAME_STATE, CELL_STATE, DIFFICULTY } from './model/constants.js';
import { renderBoard, updateCell, updateGameInfo } from './view/renderer.js';
import { setupInput } from './controller/input.js';

// DOM references
const boardEl = document.getElementById('board');
const mineCountEl = document.getElementById('mine-count');
const timerEl = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const diffBtns = document.querySelectorAll('.diff-btn');

// Game state
let game = null;
let timerInterval = null;
let currentDifficulty = 'beginner';

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimer() {
  stopTimer();
  game.timer = 0;
  timerInterval = setInterval(() => {
    if (game.timer < 999) {
      game.timer++;
      timerEl.textContent = String(game.timer).padStart(3, '0');
    }
  }, 1000);
}

function renderFull() {
  renderBoard(game.board, boardEl);
  updateGameInfo(game, mineCountEl, timerEl, resetBtn);
}

function updateSingleCell(row, col) {
  const index = row * game.board[0].length + col;
  const cellEl = boardEl.children[index];
  if (cellEl) {
    updateCell(game.board[row][col], cellEl);
  }
}

function handleCellReveal(row, col) {
  const prevState = game.state;

  // Chord: clicking an already-revealed number cell
  if (game.state === GAME_STATE.PLAYING) {
    const cell = game.board[row][col];
    if (cell.state === CELL_STATE.REVEALED && cell.adjacentMines > 0) {
      handleChord(game, { row, col });
      renderFull();
      if (game.state === GAME_STATE.LOST || game.state === GAME_STATE.WON) {
        stopTimer();
        updateGameInfo(game, mineCountEl, timerEl, resetBtn);
      }
      return;
    }
  }

  handleReveal(game, { row, col });

  // Start timer on first click
  if (prevState === GAME_STATE.IDLE && game.state === GAME_STATE.PLAYING) {
    startTimer();
  }

  // Re-render entire board (flood fill changes many cells)
  renderFull();

  if (game.state === GAME_STATE.LOST || game.state === GAME_STATE.WON) {
    stopTimer();
    updateGameInfo(game, mineCountEl, timerEl, resetBtn);
  }
}

function handleCellFlag(row, col) {
  handleFlag(game, { row, col });
  updateSingleCell(row, col);
  updateGameInfo(game, mineCountEl, timerEl, resetBtn);
}

function handleDifficultyChange(difficulty) {
  if (!DIFFICULTY[difficulty]) return;
  currentDifficulty = difficulty;

  // Update active button
  diffBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
  });

  resetGame();
}

function handleReset() {
  resetGame();
}

function resetGame() {
  stopTimer();
  game = initGame(currentDifficulty);
  renderFull();
}

// Initialize
setupInput({
  onReveal: handleCellReveal,
  onFlag: handleCellFlag,
  onDifficulty: handleDifficultyChange,
  onReset: handleReset,
});

resetGame();
