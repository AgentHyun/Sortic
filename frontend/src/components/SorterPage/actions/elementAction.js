import axios from 'axios';
import { atom } from 'jotai';
import { message } from 'antd';

import {
    messageApiAtom,
    contextHolderAtom,
    addCategoryModalVisibleAtom,
    addElementModalVisibleAtom,
    sorterModalVisibleAtom,
    newCategoryAtom,
    categoriesAtom,
    currentCategoryAtom,
    currentCategoryNameAtom,
    isEditingCategoryAtom,
    newCategoryNameAtom,
    currentElementNameAtom,
    isEditingElementAtom,
    editingElementIndexAtom,
    newElementNameAtom,
    elementsDataAtom,
    addElementNameAtom,
    addElementCostAtom,
    addElementKeyAtom,
    addElementValueAtom,
    cardsAtom,
    updatedSortersAtom,
    sorterNameAtom,
    isEditingSorterAtom,
    newSorterNameAtom,
    sortersAtom,
    editingSorterIndexAtom,
    containerRefAtom,
    isDraggingAtom,
    startXAtom,
    scrollLeftAtom,
    originalElementNameAtom,
    selectedElementIdAtom,
    messageAtom, attributeModalVisibleAtom,
    selectedElementIdsAtom, addedElementIdAtom
} from '../atoms/atoms';

// Elements 가져오기
export const fetchElementsByCategoryAction = atom(
    null,
    async (get, set, categoryId) => {
        try {
            const response = await axios.get('http://localhost:8080/api/elements/get_elements_by_category', {
                params: { category_id: categoryId },
            });

            if (Array.isArray(response.data)) {
                set(cardsAtom, response.data);
            } else {
                console.error('잘못된 데이터 형식:', response.data);
                set(messageAtom, { type: 'error', content: '카테고리 요소 조회에 실패했습니다.' });
            }
        } catch (error) {
            console.error('카테고리 요소 조회 실패', error);
            set(messageAtom, { type: 'error', content: '카테고리 요소 조회에 실패했습니다.' });
        }
    }
);
export const setSelectedElementAction = atom(
    null,
    (get, set, elementId) => {
        console.log("🖱️ 선택된 요소 ID:", elementId);
        set(selectedElementIdAtom, elementId);
    }
);

export const toggleSelectElementAction = atom(
    null,
    (get, set, elementId) => {
        const selected = get(selectedElementIdsAtom);
        if (selected.includes(elementId)) {
            // 이미 선택된 요소면 제거
            set(selectedElementIdsAtom, selected.filter(id => id !== elementId));
        } else {
            // 선택되지 않은 요소면 추가
            set(selectedElementIdsAtom, [...selected, elementId]);
        }
    }
);

export const handleBulkDeleteElementsAction = atom(
    null,
    async (get, set) => {
        const selectedIds = get(selectedElementIdsAtom);
        const cards = get(cardsAtom);

        if (selectedIds.length === 0) {
            message.warning("삭제할 요소가 선택되지 않았습니다!");
            return;
        }

        console.log("🚀 삭제 요청 보냄:", selectedIds);

        try {
            const response = await axios.delete(`http://localhost:8080/api/elements/delete_multiple_elements`, {
                data: { elements_name_ids: selectedIds },
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("✅ 삭제 응답:", response);

            // 상태 업데이트
            const updatedCards = cards.filter(card => !selectedIds.includes(card.elements_name_id));
            set(cardsAtom, updatedCards);
            set(selectedElementIdsAtom, []);
            message.success("요소들이 삭제되었습니다!");
        } catch (error) {
            console.error("🚨 일괄 삭제 실패:", error.response?.data || error.message);
            message.error("요소 삭제에 실패했습니다.");
        }
    }
);


export const addElementAction = atom(
    null,
    async (get, set) => {
        const currentCategory = get(currentCategoryAtom);

        if (!currentCategory) {
            set(messageAtom, { type: 'warning', content: '카테고리를 먼저 추가하세요.' });
            return;
        }

        // ✅ 추가할 요소의 기본 정보 설정
        const newElement = {
            category_id: currentCategory,
            elements_name: get(addElementNameAtom),
            elements_price: get(addElementCostAtom),
            elements_image: "default_image_url"
        };

        try {
            // ✅ 서버에 요소 추가 요청
            const response = await axios.post('http://localhost:8080/api/elements/add_element', newElement);
            if (response.status === 200) {
                console.log("✅ 요소 추가 성공!", response.data);
                const newElementId = response.data.elements_name_id;
                // ✅ 최신 요소 목록 다시 가져오기 (useSetAtom(fetchElementsByCategoryAction)으로 실행해야 함)
                set(fetchElementsByCategoryAction, currentCategory);
                set(addedElementIdAtom, newElementId);
                set(addElementNameAtom, "");
                set(addElementCostAtom, "");

                set(addElementModalVisibleAtom, false);
                set(attributeModalVisibleAtom, true);
                set(messageAtom, { type: 'success', content: '요소가 추가되었습니다.' });
            }
        } catch (error) {
            set(messageAtom, { type: 'error', content: '요소 추가 실패!' });
            console.error("🚨 요소 추가 오류:", error);
        }
    }
);



export const handleDeleteElementAction = atom(
    null,
    async (get, set) => {
        const selectedElementId = get(selectedElementIdAtom);
        const cards = get(cardsAtom);

        if (!selectedElementId) {
            message.warning("삭제할 요소가 선택되지 않았습니다!");
            console.warn("🚨 삭제할 요소가 선택되지 않았습니다!");
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/elements/delete_element`, {
                params: { elements_name_id: selectedElementId }
            });



            // 상태 업데이트 (삭제된 요소 제외)
            const updatedCards = cards.filter(card => card.elements_name_id !== selectedElementId);
            set(cardsAtom, updatedCards);
            set(selectedElementIdAtom, null); // 선택 상태 초기화
            message.success("요소 삭제 성공!");

        } catch (error) {
            console.warn("🚨 요소 삭제 실패!");
            console.error("에러 상세:", error.response?.data || error.message);
        }
    }
);
// 요소 이름 변경 핸들러
export const handleElementNameChangeAction = atom(
    (get) => get(newElementNameAtom),
    (get, set, e) => {

    }
);

// 요소 더블 클릭으로 편집 모드 시작

// 요소 더블 클릭으로 편집 모드 시작
export const handleElementDoubleClickAction = atom(
    null,
    (get, set, elementId) => {
        const cards = get(cardsAtom); // 현재 요소 리스트 가져오기
        const targetElement = cards.find((card) => card.elements_name_id === elementId); // ID로 요소 찾기

        if (!targetElement) {
            console.error("해당 ID의 요소를 찾을 수 없습니다:", elementId);
            return;
        }
        set(originalElementNameAtom, targetElement.elements_name || '');
        // 요소 편집 상태 설정
        set(editingElementIndexAtom, elementId); // ID 저장
        set(isEditingElementAtom, true); // 편집 모드 활성화
        set(newElementNameAtom, targetElement.elements_name || ''); // 기존 이름 가져오기

        set(currentElementNameAtom, targetElement.elements_name || ''); // 현재 이름 백업
    }
);





// 상품 추가 성공 메시지
const success = (msg, set) => {
    set(messageAtom, { type: 'success', content: msg });
};

// 상품 추가 경고 메시지
const warning = (msg, set) => {
    set(messageAtom, { type: 'warning', content: msg });
};

// 상품 추가 액션
const API_BASE_URL = '/api/products';

export const handleElementOkAction = atom(
    null,
    async (get, set) => {
        const newElementName = get(newElementNameAtom);
        const newElementCost = get(addElementCostAtom);
        const cards = get(cardsAtom);
        const currentCategory = get(currentCategoryAtom);
        const card_image = "default_image_url"; // 이미지 URL 하드코딩 (필요시 수정)

        if (!newElementName || !newElementCost) {
            warning('상품 이름과 가격을 입력하세요.', set);
            return;
        }

        const productCost = parseInt(newElementCost, 10);
        if (isNaN(productCost)) {
            warning('가격은 숫자만 입력 가능합니다.', set);
            return;
        }

        const newElement = {
            category_id: currentCategory,
            elements_name: newElementName,
            elements_price: productCost || 0,
            elements_image: card_image,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/elements/add_element', newElement);

            success('상품이 추가되었습니다!', set);
            set(cardsAtom, [...cards, newElement]);
            set(addElementModalVisibleAtom, false);
            set(newElementNameAtom, '');

        } catch (error) {
            warning('상품 추가 실패!', set);
            console.error(error);
        }
    }
);

export const handleElementNameSaveAction = atom(
    null,
    async (get, set) => {
        const newElementName = get(newElementNameAtom);
        const editingElementIndex = get(editingElementIndexAtom);
        const cards = get(cardsAtom);

        if (!newElementName) {
            console.warn("🚨 상품 이름을 입력하세요.");
            return;
        }

        if (!editingElementIndex && editingElementIndex !== 0) {
            console.warn("🚨 유효하지 않은 요소 ID!");
            return;
        }

        try {
            await axios.put('http://localhost:8080/api/elements/update_element', {
                elements_name_id: editingElementIndex,
                elements_name: newElementName  // ✅ 한글 그대로 전송
            }, {
                headers: { 'Content-Type': 'application/json; charset=UTF-8' }  // ✅ UTF-8 명시
            });

            message.success("상품 이름 수정 완료!");
            console.log("✅ 서버 요청 성공!");

            // 수정된 요소를 반영한 새로운 카드 리스트 생성
            const updatedCards = cards.map(card =>
                card.elements_name_id === editingElementIndex
                    ? { ...card, elements_name: newElementName }  // 이름 변경 적용
                    : card
            );

            // 상태 업데이트
            set(cardsAtom, updatedCards);
            set(isEditingElementAtom, false);
            set(editingElementIndexAtom, null);

        } catch (error) {
            console.warn("🚨 상품 이름 수정 실패!");
            console.error("에러 상세:", error.response?.data || error.message);
        }
    }
);



// 현재 카테고리 설정 액션
export const setCurrentCategoryAction = atom(
    null,
    (get, set, categoryId) => {
        set(currentCategoryAtom, categoryId);
    }
);
