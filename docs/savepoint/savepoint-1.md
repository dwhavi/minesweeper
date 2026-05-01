# Save Point 1 — 게임 구현 완료

## 완료된 작업
- Task 3: constants.js (난이도 프리셋, 셀 상수) + TDD
- Task 4: board.js (보드 생성, 지뢰 배치, 첫 클릭 안전) + TDD
- Task 5: cell.js (셀 공개, flood fill, 깃발) + TDD
- Task 6: game.js (승패 판정, 첫 클릭 안전, 타이머) + TDD
- Task 7: renderer.js (DOM 렌더링)
- Task 8: input.js (이벤트 위임)
- Task 9: main.js 통합
- Task 10: style.css 완성 + 반응형 다크 테마

## 테스트 결과
- 4 test files, 47 tests — ALL PASSING

## 생성/수정 파일
- `src/model/constants.js` — DIFFICULTY, CELL_STATE, GAME_STATE, NEIGHBOR_OFFSETS, NUMBER_COLORS
- `src/model/board.js` — createBoard, placeMines, calculateAdjacent
- `src/model/cell.js` — revealCell, toggleFlag, revealAllMines
- `src/model/game.js` — initGame, handleReveal, handleFlag, checkWin
- `src/view/renderer.js` — renderBoard, updateCell, updateGameInfo
- `src/controller/input.js` — setupInput (이벤트 위임)
- `src/main.js` — 게임 초기화, 타이머, 이벤트 연결
- `style.css` — 다크 테마, 반응형, 적응형 셀 사이즈
- `__tests__/constants.test.js` — 5 tests
- `__tests__/board.test.js` — 10 tests
- `__tests__/cell.test.js` — 12 tests
- `__tests__/game.test.js` — 20 tests
- `vitest.config.js` — Vitest 설정

## 복구 방법
1. `npm install && npm test`로 테스트 확인
2. `npm run dev`로 로컬 실행
3. 모든 구현 완료 상태

## 다음 단계
- Vercel 배포
