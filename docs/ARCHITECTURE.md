# Architecture — Minesweeper

## MVC 패턴

```
┌─────────────────────────────────────────────────┐
│                   Controller                     │
│         (src/controller/)                        │
│  ── 사용자 입력 처리, 이벤트 위임                 │
│  ── Model ↔ View 중재                            │
└──────────┬──────────────────────┬────────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐    ┌──────────────────┐
│     Model        │    │      View        │
│  (src/model/)    │    │   (src/view/)    │
│                  │    │                  │
│  ── 보드 생성     │    │  ── DOM 렌더링   │
│  ── 지뢰 배치     │    │  ── 상태 표시     │
│  ── 클릭 처리     │    │  ── 타이머/카운터 │
│  ── 승패 판정     │    │  ── 셀 업데이트   │
└──────────────────┘    └──────────────────┘
         │ DOM 없음            │ 순수 DOM
```

## 데이터 흐름

```
1. 사용자 클릭 → Controller가 이벤트 감지 (이벤트 위임)
2. Controller → Model.update(row, col) 호출
3. Model → 게임 상태 계산 → 새 상태 반환
4. Controller → View.render(state) 호출
5. View → DOM 업데이트
```

## 모듈 의존 관계

```
src/main.js
  ├── src/controller/GameController.js
  │     ├── src/model/Board.js
  │     │     └── src/model/constants.js
  │     └── src/view/BoardView.js
  │           └── src/model/constants.js (난이도 설정만)
  └── src/view/BoardView.js

규칙: Model → View 의존 금지 (단방향)
```

## 파일 구조

```
minesweeper/
├── index.html              # 진입점 HTML
├── style.css               # 전역 스타일
├── package.json            # 프로젝트 설정
├── vitest.config.js        # 테스트 설정
├── AGENTS.md               # 에이전트 가이드
├── src/
│   ├── main.js             # 앱 초기화
│   ├── model/
│   │   ├── constants.js    # 난이도, 상수 정의
│   │   ├── Board.js        # 보드 생성/조작 로직
│   │   └── GameState.js    # 게임 상태 관리
│   ├── view/
│   │   ├── BoardView.js    # 보드 DOM 렌더링
│   │   └── HeaderView.js   # 헤더(타이머, 카운터) 렌더링
│   └── controller/
│       └── GameController.js # 이벤트 처리, MVC 중재
├── __tests__/
│   ├── model/
│   │   ├── Board.test.js
│   │   └── GameState.test.js
│   ├── view/
│   │   └── BoardView.test.js
│   └── controller/
│       └── GameController.test.js
└── docs/
    ├── AGENTS.md
    ├── ARCHITECTURE.md
    ├── golden-rules.md
    ├── dev-principles.md
    ├── plans/
    └── savepoint/
```

## 핵심 설계 원칙

- **Model 순수성**: Model은 순수 함수/객체로, DOM에 접근하지 않음. 테스트 가능성 극대화.
- **이벤트 위임**: Controller는 보드 컨테이너 하나에만 이벤트 리스너를 바인딩.
- **상태 불변성**: Model은 기존 상태를 변경하지 않고 새 상태를 반환.
- **관심사 분리**: 각 모듈은 단일 책임만 가짐.
