// src/controller/input.js — Event delegation for game input
export function setupInput({ onReveal, onFlag, onDifficulty, onReset }) {
  const boardEl = document.getElementById('board');

  // Prevent context menu on board
  boardEl.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Event delegation for left/right click on cells
  boardEl.addEventListener('click', (e) => {
    const cellEl = e.target.closest('.cell');
    if (!cellEl) return;
    const row = parseInt(cellEl.dataset.row, 10);
    const col = parseInt(cellEl.dataset.col, 10);
    if (isNaN(row) || isNaN(col)) return;
    onReveal(row, col);
  });

  boardEl.addEventListener('contextmenu', (e) => {
    const cellEl = e.target.closest('.cell');
    if (!cellEl) return;
    const row = parseInt(cellEl.dataset.row, 10);
    const col = parseInt(cellEl.dataset.col, 10);
    if (isNaN(row) || isNaN(col)) return;
    onFlag(row, col);
  });

  // Difficulty buttons
  document.querySelectorAll('.diff-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const difficulty = btn.dataset.difficulty;
      if (difficulty) onDifficulty(difficulty);
    });
  });

  // Reset button
  document.getElementById('reset-btn').addEventListener('click', () => {
    onReset();
  });
}
