# 📄 브랜치 네이밍 규칙 (Jira + Notion 기준 + 작업자 구분형)

## ✅ 기본 원칙
- 영문 소문자만 사용
- 공백 대신 하이픈(-) 사용
- 브랜치 구조: `작업유형/작업자이니셜/기능명`
- Jira 이슈 키는 선택적으로 포함 (예: `feature/s/SORTIC-123-login`)

## 📁 브랜치 타입(prefix) 목록

| 타입       | 설명               | 예시                        |
|------------|--------------------|-----------------------------|
| `feature/` | 기능 개발          | `feature/s/signup`          |
| `fix/`     | 버그 수정          | `fix/k/billpage-error`      |
| `hotfix/`  | 긴급 수정          | `hotfix/s/token-reissue`    |
| `refactor/`| 코드 리팩토링      | `refactor/l/sorterdnd`      |
| `chore/`   | 설정/배포/문서 등  | `chore/l/eslint-update`     |
| `test/`    | 테스트 코드 작업   | `test/k/login-api-test`     |

## 📌 브랜치 구조 (작업자 기준)

> 형식: `type/작업자이니셜/기능명`

| 담당자 | 예시                        |
|--------|-----------------------------|
| 래현   | `feature/l/sorterdnd`       |
| 기빈   | `feature/k/billpage`        |
| 성민   | `feature/s/signup`          |

※ 필요 시 이슈 키 포함: `feature/s/SORTIC-110-login`

## 🔗 Jira 연동 예시
- `feat/s/SORTIC-142-login-api`
- `fix/k/SORTIC-145-token-error`

## 🚫 금지되는 브랜치 예시

| 잘못된 브랜치명       | 이유                       |
|------------------------|----------------------------|
| `Feature/LoginPage`    | 대문자 사용 ❌             |
| `fix login`            | 공백 사용 ❌               |
| `feature/@signup`      | 특수문자 포함 ❌           |
| `signup/feature/s`     | 역할 구분 모호 ❌         |

## 💡 작성 팁
- 브랜치명은 짧고 목적이 분명해야 함
- 하나의 브랜치에는 **한 가지 작업 목적만**
- 작업 완료 후 Pull Request → 병합 또는 삭제
- Jira 이슈 키는 브랜치명뿐 아니라 커밋/PR 제목에도 포함 권장

## 📘 예시 목록
- 로그인 기능 개발           → `feat/s/signup`
- Bill 페이지 리팩토링       → `refactor/k/bill-ui`
- 토큰 만료 버그 수정        → `fix/s/token-expiry`
- GitHub Actions 설정        → `chore/l/github-actions`
- ERD 문서 정리              → `chore/s/db-doc-update`
