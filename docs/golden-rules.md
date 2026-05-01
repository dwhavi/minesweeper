# Golden Rules — Minesweeper

5가지 핵심 규칙. 모든 개발 활동에서 엄격히 준수.

---

## GR-1: 로직-UI 분리 (Logic-UI Separation)

**규칙**: Model 레이어(src/model/)에서는 DOM API 접근을 완전히 금지.

**적용 범위**:
- `document`, `window`, `HTMLElement`, `Event` 등의 사용 금지
- `console.log` 금지 (테스트 파일은 예외)
- Model 함수는 순수 함수 또는 순수 객체로 작성

**검증 방법**:
- Model 파일에서 `document.` 또는 `window.` 검색 → 0건이어야 함
- Model 단위 테스트는 jsdom 없이도 통과 가능해야 함

**사례**:
```js
// ❌ 위반
function revealCell(board, row, col) {
  document.querySelector(`[data-row="${row}"]`).classList.add('revealed');
}

// ✅ 올바름
function revealCell(board, row, col) {
  return { ...board, revealed: [...board.revealed, `${row},${col}`] };
}
```

---

## GR-2: TDD 강제 (Test-Driven Development)

**규칙**: Model의 모든 공개 함수는 테스트가 선행되어야 함.

**적용 범위**:
- Model 함수 추가/수정 시 반드시 해당 테스트 먼저 작성
- RED-GREEN-REFACTOR 주기 준수
  1. RED: 실패하는 테스트 작성
  2. GREEN: 최소 코드로 테스트 통과
  3. REFACTOR: 코드 정리

**검증 방법**:
- `npm test` 항상 통과 상태 유지
- 커밋 전 `npm test` 실행 필수

---

## GR-3: 파일 크기 제한 (200 Lines Max)

**규칙**: 단일 파일은 200줄(공백 포함)을 초과하지 않음.

**적용 범위**:
- 모든 `.js`, `.css`, `.html` 파일
- 예외: 자동 생성 파일, 문서 파일

**검증 방법**:
- `wc -l src/**/*.js` 로 확인
- 초과 시 적절히 모듈 분할

**분할 기준**:
- Model: 기능별로 Board.js, GameState.js 등 분리
- View: 렌더링 대상별로 분리
- Controller: 이벤트 핸들러별로 분리

---

## GR-4: 매직 넘버 금지 (No Magic Numbers)

**규칙**: 숫자 리터럴을 코드에 직접 작성하지 않음. constants.js에서 관리.

**적용 범위**:
- 보드 크기, 지뢰 수, 타이머 간격 등 모든 숫자 상수
- 예외: 0, 1, -1 (수학적 의미), 배열 인덱스

**검증 방법**:
- 숫자 리터럴(0,1,-1 제외)이 constants.js에 정의되어 있는지 확인

**사례**:
```js
// ❌ 위반
const board = createBoard(9, 9, 10);

// ✅ 올바름
import { BEGINNER } from './constants.js';
const board = createBoard(BEGINNER.rows, BEGINNER.cols, BEGINNER.mines);
```

**constants.js 구조**:
```js
export const DIFFICULTY = {
  beginner:     { rows: 9,  cols: 9,  mines: 10  },
  intermediate: { rows: 16, cols: 16, mines: 40  },
  expert:       { rows: 16, cols: 30, mines: 99  },
};
```

---

## GR-5: 이벤트 위임 (Event Delegation)

**규칙**: 개별 셀에 이벤트 리스너를 직접 바인딩하지 않음. 컨테이너 단위 위임 사용.

**적용 범위**:
- 보드 셀 클릭/우클릭 이벤트
- 동적으로 생성/제거되는 모든 UI 요소

**검증 방법**:
- `addEventListener` 호출이 컨테이너(#board)에만 있는지 확인
- 셀 수만큼 리스너가 생성되지 않는지 확인

**사례**:
```js
// ❌ 위반: 각 셀에 리스너 바인딩
cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});

// ✅ 올바름: 컨테이너에 위임
boardEl.addEventListener('click', (e) => {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const { row, col } = cell.dataset;
  handleCellClick(row, col);
});
```

**이유**: 성능 최적화 + 동적 요소 자동 처리
