import { atom } from 'jotai';
export const billsAtom = atom([])
export const billElementsAtom = atom([]);
export const messageAtom = atom(null);
export const isModalVisibleAtom = atom (false);

export const detailModalVisibleAtom = atom(false);
export const selectedBillDetailsAtom = atom([]);
export const selectedBillTitleAtom = atom('');
export const commissionModalVisibleAtom = atom(false);
export const selectedBillIdAtom = atom(null);
export const selectedBillForCommissionAtom = atom(null);
export const commissionAddModalVisibleAtom = atom(false);
export const commissionNameAtom = atom('');
export const commissionValueAtom = atom('');
export const selectedCommissionIdsAtom = atom([]);
