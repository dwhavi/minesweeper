# 개발 원칙

## TDD (Test-Driven Development)
- RED-GREEN-REFACTOR 주기 엄격 준수
- 테스트 먼저 작성, 실패 확인, 최소 구현, 통과 확인
- 모든 Model 로직은 반드시 테스트 선행

## MVC 패턴
- Model: 게임 로직 (board, cell, game) — DOM 의존 없이 순수 함수
- View: DOM 렌더링 (renderer, modal)
- Controller: 이벤트 처리 (input)
- 의존 방향: View → Model, Controller → Model+View (역방향 금지)

## Golden Rules
- GR-1: 로직-UI 분리 (Model에 DOM 접근 금지)
- GR-2: TDD 강제 (Model 함수는 실패 테스트 먼저)
- GR-3: 파일 크기 200줄 이내
- GR-4: 매직 넘버 금지 (constants.js로 관리)
- GR-5: 이벤트 위임 (개별 셀 바인딩 금지)

## 규칙
- patch 툴 사용 금지, write_file만 사용
- 파일 내용 터미널 출력 금지, 성공 여부만 간결히
- 커밋 메시지: feat/fix/docs: 설명
