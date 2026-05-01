# Minesweeper — AGENTS.md

## 개요
클래식 지뢰찾기 웹 게임. 초급/중급/고급 3단계 난이도 지원.

## 기술 스택
HTML5 + CSS3 + Vanilla JavaScript (ES Modules), Vitest, Vite

## 아키텍처
MVC 패턴 — Model(게임 로직, DOM 의존 없음) / View(DOM 렌더링) / Controller(이벤트 위임)
상세: docs/ARCHITECTURE.md

## 핵심 규칙
1. 로직-UI 분리: Model에 DOM 접근 금지
2. TDD 강제: Model 함수는 실패 테스트 먼저
3. 파일 크기 200줄 이내
4. 매직 넘버 금지: constants.js로 관리
5. 이벤트 위임: 개별 셀 바인딩 금지
상세: docs/golden-rules.md

## 문서 색인
| 문서 | 내용 |
|------|------|
| docs/ARCHITECTURE.md | 아키텍처 상세 |
| docs/golden-rules.md | Golden Rules 전체 |
| docs/dev-principles.md | 개발 원칙 |
| docs/plans/2026-05-01-minesweeper.md | 전체 구현 계획 |
| docs/savepoint/ | 세이브포인트 |

## 작업 규칙
- 프롬프트로 지시, 직접 코드 작성 금지
- TDD: RED-GREEN-REFACTOR 주기 엄격 준수
- patch 툴 사용 금지, write_file만 사용
- 파일 내용 터미널 출력 금지, 성공 여부만 간결히
- 커밋 메시지: feat/fix/docs: 설명
- 큰 작업은 docs/plans/에 계획 생성
