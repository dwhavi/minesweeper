// src/main.js — Minesweeper entry point
import { createGame, handleReveal, handleFlag, getGameStatus } from './model/game.js';
import { GAME_STATUS, DIFFICULTY } from './model/constants.js';
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
  const status = handleReveal(game, row, col);

  // Start timer on first click
  if (!game.firstClick && !timerInterval && status === GAME_STATUS.PLAYING) {
    startTimer();
  }

  // Re-render entire board (flood fill changes many cells)
  renderFull();

  if (status === GAME_STATUS.LOST || status === GAME_STATUS.WON) {
    stopTimer();
    updateGameInfo(game, mineCountEl, timerEl, resetBtn);
  }
}

function handleCellFlag(row, col) {
  handleFlag(game, row, col);
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

  initGame();
}

function handleReset() {
  initGame();
}

function initGame() {
  stopTimer();
  game = createGame(currentDifficulty);
  renderFull();
}

// Initialize
setupInput({
  onReveal: handleCellReveal,
  onFlag: handleCellFlag,
  onDifficulty: handleDifficultyChange,
  onReset: handleReset,
});

initGame();
