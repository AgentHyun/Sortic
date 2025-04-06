import { atom } from 'jotai';
import axios from 'axios';
import {
    keyValuePairsAtom,
    addedElementIdAtom,
    messageAtom,
    attributeModalVisibleAtom,
} from '../atoms/atoms';

export const elementsDataAction = atom(
    null,
    async (get, set) => {
        const keyValuePairs = get(keyValuePairsAtom);
        const elementId = get(addedElementIdAtom);

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