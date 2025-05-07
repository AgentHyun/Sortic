import { atom } from 'jotai';

export const userAtom = atom({
    user_id: '',
    nickname: '',
    profileImage: '/public/profile-images/profile-default.png',
    phone: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: ''
}); 