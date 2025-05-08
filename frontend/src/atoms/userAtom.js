// src/atoms/UserAtom.js
import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';

export const userAtom = atom({
  user_id: '', // 아이디
  password: '',
  confirmPassword: '',
  username: '',
  phone: '',
  email: '',
  region: '',
  grade: 0,
  profileImage: '/public/profile-images/profile-default.png',
});

// user_id만 추출한 atom
export const userIdAtom = selectAtom(userAtom, (user) => user.user_id);
