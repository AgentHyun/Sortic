# Sortic Project

## 📝 프로젝트 소개
Sortic는 도매상가의 상품 관리를 위한 웹 애플리케이션입니다. 상품 분류, 가격 관리, 계산서 작성 등의 기능을 제공합니다.

## 🛠 기술 스택
### Frontend
- React 18
- Ant Design
- Jotai (상태 관리)
- Axios (API 통신)

### Backend
- Spring Boot 3.2.3
- MySQL 8.0
- MyBatis
- JWT (인증)

## 🚀 시작하기
### 필수 요구사항
- Node.js 18+
- JDK 17+
- MySQL 8.0+

### 설치 및 실행
1. 저장소 클론
```bash
git clone https://github.com/SorticProject/Sortic
cd Sortic
```

2. Frontend 설정
```bash
cd frontend
npm install
npm start
```

3. Backend 설정
```bash
cd backend
./gradlew build
./gradlew bootRun
```

## 🔑 주요 기능
- 사용자 인증 (로그인/회원가입)
- 상품 카테고리 관리
- 상품 정보 관리
- 계산서 작성 및 관리
- 도매 링크 관리

## 📁 프로젝트 구조
```
sortic/
├── frontend/          # React 프론트엔드
│   ├── src/
│   │   ├── Api/      # API 통신
│   │   ├── auth/     # 인증 관련
│   │   └── components/ # UI 컴포넌트
│   └── public/       # 정적 파일
│
└── backend/          # Spring Boot 백엔드
    ├── src/
    │   ├── main/
    │   │   ├── java/  # 소스 코드
    │   │   └── resources/ # 설정 파일
    │   └── test/     # 테스트 코드
    └── build/        # 빌드 결과물
```

## 🔒 보안
- JWT 기반 인증
- 비밀번호 암호화
- CORS 설정
- XSS 방지

## 📚 협업 규칙
브랜치 네이밍 가이드

커밋 & PR 작성 가이드

이슈 템플릿 및 작업 방식

## 📄 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.