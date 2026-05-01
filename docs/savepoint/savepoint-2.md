# Save Point 2 — Model 로직 완료 (Task 3~6)

## 완료된 작업
- Task 3: src/model/constants.js — DIFFICULTY, CELL_STATE, GAME_STATE, NEIGHBOR_OFFSETS, NUMBER_COLORS
- Task 4: src/model/board.js — createBoard, placeMines, calculateAdjacentMines
- Task 5: src/model/cell.js — revealCell (BFS flood fill), toggleFlag
- Task 6: src/model/game.js — initGame, handleReveal (첫 클릭 안전), handleFlag, checkWin
- 불필요한 src/constants.js 제거, src/model/constants.js로 통합

## 테스트
- 47 tests / 4 files — ALL PASSED
- __tests__/constants.test.js (5), board.test.js (10), cell.test.js (12), game.test.js (20)

## 생성/수정 파일
- `src/model/constants.js`, `src/model/board.js`, `src/model/cell.js`, `src/model/game.js`
- `__tests__/constants.test.js`, `__tests__/board.test.js`, `__tests__/cell.test.js`, `__tests__/game.test.js`

## 복구 방법
1. `docs/INDEX.md` 읽고 작업 매핑 확인
2. `docs/dev-principles.md` 읽고 개발 원칙 준수
3. `npm test` 로 테스트 상태 확인

## 다음 단계
- **Task 7:** renderer.js — DOM 렌더링
- **Task 8:** input.js — 이벤트 위임
- **Task 9:** main.js 통합
- **Task 10:** CSS 완성 + 반응형
