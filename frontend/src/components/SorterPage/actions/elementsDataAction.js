import {atom, useAtom} from 'jotai';
import axios from 'axios';
import { message } from 'antd';
import {
    keyValuePairsAtom,
    addedElementIdAtom,
    messageAtom,
    attributeModalVisibleAtom,
    elementDetailModalAtom,
    elementDetailDataAtom, elementAttributesAtom,selectedElementIdAtom,
    tempValueAtom,  elementsDataAtom, editingElementIndexAtom, editingElementIdAtom,
  defaultAttributesAtom
} from '../atoms/atoms';


export const elementsDataAction = atom(
    null,
    async (get, set) => {
        const keyValuePairs = get(keyValuePairsAtom);
        const elementId = get(selectedElementIdAtom);

        // 유효성 검사
        if (!elementId) {
            set(messageAtom, { type: 'warning', content: '요소를 먼저 선택해주세요!' });
            return;
        }

        if (!Array.isArray(keyValuePairs) || keyValuePairs.length === 0) {
            set(messageAtom, { type: 'warning', content: '속성 정보를 입력해주세요!' });
            return;
        }

        // 유효한 key-value만 필터링
        const filteredPairs = keyValuePairs.filter(
            (pair) => pair.key?.trim() && pair.value?.trim()
        );

        if (filteredPairs.length === 0) {
            set(messageAtom, { type: 'warning', content: '빈 속성은 저장되지 않습니다.' });
            return;
        }

        // ✅ 속성 개수 제한
        if (filteredPairs.length > 10) {
            set(messageAtom, { type: 'warning', content: '속성은 최대 10개까지 등록할 수 있습니다!' });
            return;
        }

        // ✅ 서버에 보낼 데이터 형식 맞추기
        const requestData = {
            elements_name_id: elementId,
            data: filteredPairs.map(pair => ({ [pair.key]: pair.value }))
        };

        try {
            const response = await axios.post(
                'http://localhost:8080/api/elements_data/add_elements_data',
                requestData,
                {
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                }

            );
          set(defaultAttributesAtom, filteredPairs.map(p => ({ key: p.key })));

          if (response.status === 200) {
                set(messageAtom, { type: 'success', content: '속성 추가 성공!' });
                set(keyValuePairsAtom, []); // 입력 초기화
                set(attributeModalVisibleAtom, false); // 모달 닫기
            } else {
                throw new Error('서버 응답 오류');
            }
        } catch (error) {
            console.error('🚨 속성 추가 실패:', error.response?.data || error.message);
            set(messageAtom, { type: 'error', content: '속성 추가에 실패했습니다.' });
            set(keyValuePairsAtom, []);
        }
    }
);

export const openElementDetailAction = atom(null, async (get, set, data) => {
    set(elementDetailDataAtom, data);
    set(elementDetailModalAtom, true);
    const elementId = get(selectedElementIdAtom);
    try {
        const response = await axios.get(`http://localhost:8080/api/elements_data/get_elements_data`, {
            params: { elements_name_id: elementId }
        });
        set(elementAttributesAtom, response.data);
        console.log("키벨류" + elementAttributesAtom, response.data);
    } catch (error) {
        console.error('🚨 데이터 조회 실패:', error);
        set(elementAttributesAtom, []);
    }
});


export const closeElementDetailAction = atom(null, (get, set) => {
    set(elementDetailModalAtom, false);
});

export const handleKeyNameSaveAction = atom(
    null,
    async (get, set, { id, value }) => {
        const editingElementId = id;
        const elementsData = get(elementsDataAtom);

        if (!value || editingElementId == null) {
            console.warn("🚨 유효한 key_name 또는 요소 ID가 없습니다.");
            return;
        }

        try {
            await axios.put("http://localhost:8080/api/elements_data/update_key_name", null, {
                params: {
                    elements_id: editingElementId,
                    key_name: value
                }
            });

            const updatedData = elementsData.map(data =>
                data.elements_id === editingElementId
                    ? { ...data, key_name: value }
                    : data
            );

            set(elementsDataAtom, updatedData);
            set(editingElementIndexAtom, null);

        } catch (error) {
            console.error("🚨 key_name 수정 실패!", error.response?.data || error.message);
        }
    }
);

export const handleValueNameSaveAction = atom(
    null,
    async (get, set, { id, value }) => {
        const editingElementId = id;
        const elementsData = get(elementsDataAtom);

        if (!value || editingElementId == null) {
            console.warn("🚨 유효한 value_name 또는 요소 ID가 없습니다.");
            return;
        }

        try {
            await axios.put("http://localhost:8080/api/elements_data/update_value_name", null, {
                params: {
                    elements_id: editingElementId,
                    value_name: value
                }
            });

            const updatedData = elementsData.map(data =>
                data.elements_id === editingElementId
                    ? { ...data, value_name: value }
                    : data
            );

            set(elementsDataAtom, updatedData);
            set(editingElementIndexAtom, null);
        } catch (error) {
            console.error("🚨 value_name 수정 실패!", error.response?.data || error.message);
        }
    }
);


