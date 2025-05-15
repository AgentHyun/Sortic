// src/Api/index.js

export { default as authAxios } from './authAxios';  // 로그인/회원가입 인증 관련 전용 인스턴스
export { default as publicAxios } from './publicAxios';    // 나머지 공통 API 호출용 인스턴스
export { default as adminAxios } from './adminAxios';

// 이런식으로 전부 불러올 수 있음
// import { authAxios, publicAxios } from '@/Api'
// import { authAxios, publicAxios } from '@/Api';
//
// // 로그인
// authAxios.post('/login', { userId, password });
//
// // 사용자 데이터 조회
// publicAxios.get('/users/profile');



// 만약 API 인스턴스가 3개 이상 된다면 export * from './authAxios' 형태보다
// 지금처럼 명시적으로(, 쉼표 붙여서) export 해주는 방식이 더 명확하고 안전
