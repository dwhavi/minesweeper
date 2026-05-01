# Save Point 1 — 스캐폴딩 + Harness 문서 완료

## 완료된 작업
- Task 1: package.json, vitest.config.js, index.html, style.css, .gitignore 생성
- Task 2: AGENTS.md, docs/ARCHITECTURE.md, docs/golden-rules.md 작성
- npm install 완료, npm test 빈 스위트 통과 확인
- 커밋: f98f429

## 생성/수정 파일
- `package.json`, `vitest.config.js`, `index.html`, `style.css`, `.gitignore`
- `src/main.js` (placeholder)
- `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/golden-rules.md`

## 복구 방법
1. `docs/INDEX.md` 읽고 작업 매핑 확인
2. `docs/dev-principles.md` 읽고 개발 원칙 준수
3. `docs/plans/2026-05-01-minesweeper.md` 읽고 전체 계획 확인

## 다음 단계
- **Task 3:** constants.js (TDD) — 난이도 설정, 셀 상태, 게임 상태 enum
- **Task 4:** board.js (TDD) — 보드 생성, 지뢰 배치, 주변 지뢰 수
- **Task 5:** cell.js (TDD) — 셀 열기, 깃발, flood fill
- **Task 6:** game.js (TDD) — 게임 상태 관리, 승리/패배 판정
