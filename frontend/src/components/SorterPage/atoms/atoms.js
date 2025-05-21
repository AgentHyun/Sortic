import { atom } from 'jotai';
import {authUserAtom} from "../../../auth/authAtoms";

// 메시지 API 관련 상태


export const messageAtom = atom(null);
export const messageApiAtom = atom(null);
export const contextHolderAtom = atom(null);

// 모달 관련 상태
export const addCategoryModalVisibleAtom = atom(false);
export const addElementModalVisibleAtom = atom(false);
export const attributeModalVisibleAtom = atom(false);
export const sorterModalVisibleAtom = atom(false);
export const elementDetailModalAtom = atom(false);
export const popoverVisibleAtom = atom(false);
// 카테고리 관련 상태
export const newCategoryAtom = atom('');
export const categoriesAtom = atom([]);
export const currentCategoryAtom = atom(0);
export const currentCategoryNameAtom = atom('');
export const isEditingCategoryAtom = atom(false);
export const newCategoryNameAtom = atom('');
export const currentIndexAtom = atom(0);
// 요소 관련 상태
export const currentElementNameAtom = atom('');
export const isEditingElementAtom = atom(false);
export const originalElementNameAtom = atom('');
export const editingElementIndexAtom = atom(null);
export const elementsDataAtom = atom([{ key_name: "", value_name: "" }]);
export const selectedElementIdAtom = atom (0);
export const newElementNameAtom = atom('');
export const newElementPriceAtom = atom(0);
export const selectedElementIdsAtom = atom([]);
export const addElementNameAtom = atom('');
export const addElementCostAtom = atom('');
export const addElementKeyAtom = atom('');
export const addElementValueAtom = atom('');
export const keyValuePairsAtom = atom([]);
export const elementAttributesAtom = atom([])
export const addedElementIdAtom = atom(null);
export const contextMenuAtom = atom({
    visible: false,
    x: 0,
    y: 0,
    targetId: null,
});
export const costErrorAtom = atom('');
export const elementsIdListAtom = atom([]);
export const elementsRefreshTriggerAtom = atom(0);
//처음 속성값 저장하는 Atom
export const defaultAttributesAtom = atom([]);
// element name을 저장할 atom
export const elementNameAtom = atom(null);
export const elementDetailDataAtom = atom(null);
export const isEditingAtom = atom(false);
export const tempValueAtom = atom('');
export const editingElementIdAtom = atom(null);
export const elementsIdMapAtom = atom({});

// 카드 관련 상태
export const cardsAtom = atom([]);
export const sorterCardsAtom = atom([]);
export const cardsByCategoryAtom = atom({});
export const activeCardAtom = atom(null);
// 정렬기 관련 상태
export const updatedSortersAtom = atom({});
export const sorterNameAtom = atom('');
export const isEditingSorterAtom = atom(false);
export const newSorterNameAtom = atom('');
export const sortersAtom = atom([]);
export const elementNamesBySorterAtom = atom({});



// 드래그 관련 상태

export const animationClassAtom = atom('');
export const fadeInOutAtom = atom(false);

// Sorter 관련 상태
export const sorterNameByIdAtom = atom('');
export const sorterModeAtom = atom(0);
export const edtingSorterIdAtom = atom(null);
export const editedSorterNameAtom = atom("");
export const sorterInputValueAtom = atom("");
export const selectedSortersAtom = atom([]);
export const oldSorterNameAtom = atom("");
export const selectedElementIdsBySorterAtom = atom({});
export const selectedElementNamesBySorterAtom = atom({});
export const selectedSorterIdsAtom = atom([]);
export const selectedElementIdSorterAtom = atom(0);
export const isDraggingElementsAtom = atom(false);


// 도매
export const selectedUserWholesaleLinkIdAtom = atom(0);
export const isClonedAtom = atom(false);
export const usernamesByCodeIdAtom = atom({});

// 성민
export const userAtom = atom({
    nickname: 'Guest',
    loggedIn: false,
});

// 로그인 상태 관리
export const isLoggedInAtom = atom(false);  // 기본값은 로그아웃 상태 (false)
const selectedUserIdInternalAtom = atom(null);
export const wholesalerIdAtom = atom(null);
// 외부에서 읽고 쓸 수 있는 atom (로그인 유저 ID를 기본값으로 제공)
export const selectedUserIdAtom = atom(
  (get) => {
    const internalValue = get(selectedUserIdInternalAtom);
    if (internalValue !== null) return internalValue;

    const authUser = get(authUserAtom);
    return authUser?.userId || null;
  },
  (get, set, newUserId) => {
    set(selectedUserIdInternalAtom, newUserId);
  }
);
export const currentUserIdAtom = atom((get) => {
  const authUser = get(authUserAtom);
  return authUser?.userId || null;
});
export const currentUserNameAtom = atom (null);
export const isExternalUserAtom = atom(false);
export const selectedUserNameAtom = atom(null);



//

