import { atom } from 'jotai';

export const userAtom = atom(null);
export const setUserAtom = atom(
  null,
  (get, set, userInfo) => {
    set(userAtom, userInfo);
  }
);
