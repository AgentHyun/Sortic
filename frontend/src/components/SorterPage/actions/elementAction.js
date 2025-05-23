import publicAxios from '../../../axios/publicAxios';
import axios from 'axios';
import { atom, useSetAtom, useAtomValue , useAtom} from 'jotai';
import { message } from 'antd';

import {
  addElementModalVisibleAtom,
  currentCategoryAtom,
  currentElementNameAtom,
  isEditingElementAtom,
  editingElementIndexAtom,
  newElementNameAtom,
  addElementNameAtom,
  addElementCostAtom,
  cardsAtom,
  originalElementNameAtom,
  selectedElementIdAtom,
  messageAtom, attributeModalVisibleAtom,
  selectedElementIdsAtom, addedElementIdAtom,
  contextMenuAtom,
  newElementPriceAtom, cardsByCategoryAtom,
  sorterCardsAtom, selectedElementIdsBySorterAtom, activeCardAtom, keyValuePairsAtom, defaultAttributesAtom
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
    const selectedIdsBySorter = get(selectedElementIdsBySorterAtom);
    const cards = get(cardsAtom);

    const hasGlobalSelection = selectedIds.length > 0;
    const hasGroupedSelection = Object.values(selectedIdsBySorter).some(list => list.length > 0);

    if (!hasGlobalSelection && !hasGroupedSelection) {
      message.warning("삭제할 요소가 선택되지 않았습니다!");
      return;
    }

    try {
      // 전역 선택된 요소 삭제 요청
      if (hasGlobalSelection) {
        console.log("🚀 전역 삭제 요청 보냄:", selectedIds);
        const response = await axios.delete(`http://localhost:8080/api/elements/delete_multiple_elements`, {
          data: { elements_name_ids: selectedIds },
          headers: { 'Content-Type': 'application/json' }
        });

        console.log("✅ 전역 삭제 응답:", response);

        // 삭제된 요소 이름들 추출
        const deletedNames = cards
          .filter(card => selectedIds.includes(card.elements_name_id))
          .map(card => card.elements_name);

        // 상태 업데이트
        const updatedCards = cards.filter(card => !selectedIds.includes(card.elements_name_id));
        set(cardsAtom, updatedCards);
        set(selectedElementIdsAtom, []); // 전역 선택된 요소 목록 초기화

        // 메시지 출력
        if (deletedNames.length === 1) {
          message.success(`"${deletedNames[0]}"(이)가 삭제되었습니다!`);
        } else {
          message.success("요소들이 삭제되었습니다!");
        }
      }

      if (hasGroupedSelection) {
        // 선택된 sorter 이름과 element_id들을 찾아서 삭제 요청 보냄
        for (const [sorterName, elementIds] of Object.entries(selectedIdsBySorter)) {
          if (elementIds.length > 0) {
            console.log(`🧩 [${sorterName}]에 해당하는 요소 삭제 요청 보냄:`, elementIds);

            // 서버로 전송할 데이터 형식: { sorter_id: 1, element_id: 10 } 형식으로 하나씩 삭제 요청
            for (const elementId of elementIds) {
              try {
                // 서버로 삭제 요청 보내기 (DELETE 요청 사용)
                const sorterDeleteResponse = await axios.delete(
                  `http://localhost:8080/api/sorter-element/remove`,
                  {
                    params: { sorterId: sorterName, elementId: elementId }
                  }
                );

                console.log("✅ [정렬자별 삭제 응답]:", sorterDeleteResponse);

                // 메시지 출력

              } catch (error) {
                console.error(`❌ [삭제 실패] [${sorterName}] 정렬자에서 요소 ${elementId} 삭제 실패:`, error);
              }
            }
            message.success(`요소가 삭제되었습니다!`);
            // 상태 초기화
            set(selectedElementIdsBySorterAtom, {}); // 정렬자별 선택된 요소 초기화
          }
        }
      }


    } catch (error) {
      console.error("🚨 삭제 실패:", error.response?.data || error.message);
      message.error("삭제에 실패했습니다.");
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

    // ✅ addElementCostAtom에서 쉼표를 제거한 값 가져오기
    const rawCost = get(addElementCostAtom).replace(/,/g, '');  // 쉼표 제거

    // ✅ 추가할 요소의 기본 정보 설정
    const newElement = {
      category_id: currentCategory,
      elements_name: get(addElementNameAtom),
      elements_price: rawCost,  // 쉼표 제거한 값 사용
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


        const defaults = get(defaultAttributesAtom);
        const initializedPairs = Array.isArray(defaults)
          ? defaults.map((item) => ({ key: item.key, value: '' }))  // key만 유지, value 비움
          : [];



        set(keyValuePairsAtom, initializedPairs);          // ✅ 속성 초기화
        set(selectedElementIdAtom, newElementId);          // ✅ 요소 선택 ID 설정
        set(addElementModalVisibleAtom, false);            // 🔒 모달 닫기
        set(attributeModalVisibleAtom, true);              // ✅ 속성 모달 열기

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


// 요소 더블 클릭으로 편집 모드 시작
export const handleElementDoubleClickAction = atom(
  null,
  (get, set, elementId) => {
    const cards = get(cardsAtom); // 현재 요소 리스트 가져오기
    const targetElement = cards.find((card) => card.elements_name_id === elementId); // ID로 요소 찾기
    console.log("카드 " + JSON.stringify(cards));
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



export const handleElementDoubleClickAtSorterAction = atom(
  null,
  (get, set, elementId) => {
    const cards = get(sorterCardsAtom); // 현재 요소 리스트 가져오기

    // cards가 객체 형태임을 고려한 접근
    const targetSorterId = Object.keys(cards).find(key => {
      const card = cards[key];
      return card.ids.includes(elementId); // elementId가 해당 sorter의 ids 배열에 포함되면 반환
    });

    if (!targetSorterId) {
      console.error("해당 ID의 요소를 찾을 수 없습니다:", elementId);
      return;
    }

    const targetElement = cards[targetSorterId]; // 해당 sorter의 정보 가져오기
    const targetElementName = targetElement.names[targetElement.ids.indexOf(elementId)]; // elementId에 해당하는 name 찾기

    // 요소 편집 상태 설정
    set(originalElementNameAtom, targetElementName || '');
    set(editingElementIndexAtom, elementId); // ID 저장
    set(isEditingElementAtom, true); // 편집 모드 활성화
    set(newElementNameAtom, targetElementName || ''); // 기존 이름 가져오기

    set(currentElementNameAtom, targetElementName || ''); // 현재 이름 백업
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


export const handleElementPriceSaveAction = atom(
  null,
  async (get, set) => {
    const newPrice = get(newElementPriceAtom);
    const editingElementIndex = get(editingElementIndexAtom);
    const cards = get(cardsAtom);

    if (newPrice === null || isNaN(newPrice)) {
      console.warn("🚨 유효한 가격을 입력하세요.");
      return;
    }

    if (editingElementIndex === null || editingElementIndex === undefined) {
      console.warn("🚨 유효하지 않은 요소 ID!");
      return;
    }

    try {
      await axios.put('http://localhost:8080/api/elements/update_element_price', {
        elements_name_id: editingElementIndex,
        elements_price: newPrice
      }, {
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
      });

      message.success("가격 수정 완료!");
      console.log("✅ 가격 서버 수정 성공");

      // 카드 목록 갱신
      const updatedCards = cards.map(card =>
        card.elements_name_id === editingElementIndex
          ? { ...card, elements_price: newPrice }
          : card
      );

      set(cardsAtom, updatedCards);
      set(isEditingElementAtom, false);
      set(editingElementIndexAtom, null);

    } catch (error) {
      console.warn("🚨 가격 수정 실패!");
      console.error("에러 상세:", error.response?.data || error.message);
    }
  });









export const openContextMenuAction = atom(
  null,
  (get, set, { x, y,target }) => {
    set(contextMenuAtom, {
      visible: true,
      x,
      y,
      target,
    });
  }
);

export const closeContextMenuAction = atom(
  null,
  (get, set) => {
    set(contextMenuAtom, {
      visible: false,
      x: 0,
      y: 0,
      targetElementId: null,
    });
  }
);

// 요소 아이디로 가격을 불러오는 액션 함수
export const fetchElementPriceByIdAction = atom(
  null,
  async (get, set, elementId) => {
    try {
      const response = await axios.get('http://localhost:8080/api/elements/get_element_price', {
        params: {elements_name_id: elementId}
      });

      if (typeof response.data === 'number') {

        set(newElementPriceAtom, response.data);
        return response.data;  // 가격을 반환
      } else if (response.data && response.data.elements_price !== undefined) {
        const elementPrice = response.data.elements_price;

        set(newElementPriceAtom, elementPrice);
        return elementPrice;  // 가격을 반환
      } else {
        console.error('잘못된 데이터 형식:', response.data);

        return null;  // 가격 조회 실패 시 null 반환
      }
    } catch (error) {
      console.error('가격 조회 실패', error);

      return null;  // 가격 조회 실패 시 null 반환
    }

  }

);
// 요소 ID로 이름을 불러오는 액션 함수
export const fetchElementNameByIdAction = atom(
  null,
  async (get, set, elementId) => {
    try {
      const id = typeof elementId === 'number' ? elementId : Number(elementId);
      if (isNaN(id)) {
        console.warn("🚫 elementId가 숫자가 아님:", elementId);
        set(messageAtom, { type: 'error', content: '잘못된 요소 ID입니다.' });
        return;
      }

      console.log("🛰️ 호출 URL →", `/api/elements/${id}`);

      const response = await axios.get(`http://localhost:8080/api/elements/${id}`);
      console.log("✅ 응답:", response.data);

      if (response.status === 200) {
        const elementName = response.data;
        console.log("요소 이름 " + elementName);

        set(currentElementNameAtom, elementName);
        return elementName;
      } else {
        console.error('❌ 잘못된 데이터 형식:', response.data);
        set(messageAtom, { type: 'error', content: '요소 이름을 조회할 수 없습니다.' });
      }
    } catch (error) {
      console.error('🔥 요소 이름 조회 실패', error);
      set(messageAtom, { type: 'error', content: '요소 이름 조회에 실패했습니다.' });
    }
  }
);
