// src/atoms/UserAtom.js
import { atom } from 'jotai';

export const userAtom = atom({
  user_id: '', // 아이디
  password: '', // 비밀번호
  confirmPassword: '', // 비밀번호 확인용 (프론트 전용)
  username: '', // 닉네임
  phone: '', // 전화번호
  email: '', // 이메일
  region: '', // 거주지역
  grade: 0, // 구독 등급
  profileImage: '/public/profile-images/profile-default.png', // 프로필 이미지
});
