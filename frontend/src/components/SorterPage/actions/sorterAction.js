import { atom } from 'jotai';
import axios from 'axios';
import {sortersAtom, messageAtom, elementNameAtom, elementsIdListAtom, sorterCardsAtom} from '../atoms/atoms';
import { message } from 'antd';




const renumberSorters = (list) => {
  return list.map((sorter, idx) => ({
    ...sorter,
    sorter_number: idx + 1,
    sorter_name: `sorter${idx + 1}`,
  }));
};

// 정렬자 추가
export const addSorterAction = atom(null, async (get, set) => {
  const currentSorters = get(sortersAtom);
  const newSorter = {
    user_id: 'user123', // 실제 로그인한 유저 ID로 바꿔야 함
    elements_id: null,
    sorter_number: currentSorters.length + 1,
    sorter_name: `sorter${currentSorters.length + 1}`,
  };

  try {
    const response = await axios.post('http://localhost:8080/api/sorter/add', newSorter); // ✅ 경로 수정
    set(sortersAtom, [...currentSorters, response.data]);
    set(messageAtom, { type: 'success', content: '정렬자가 추가되었습니다.' });
    console.log(get(sortersAtom));
    message.success( `sorter${currentSorters.length + 1}`+ "(이)가 추가되었습니다!");


  } catch (error) {
    console.error('🚨 정렬자 추가 실패:', error);
    set(messageAtom, { type: 'error', content: '정렬자 추가에 실패했습니다.' });
  }
});

export const addSorterWithElementIdAction = atom(null, async (get, set, elementsId) => {
  const currentSorters = get(sortersAtom);
  const newSorter = {
    user_id: 'user123', // 실제 로그인한 유저 ID로 바꿔야 함
    elements_id: elementsId,
    sorter_number: currentSorters.length + 1,
    sorter_name: `sorter${currentSorters.length + 1}`,
  };

  try {
    const response = await axios.post('http://localhost:8080/api/sorter/add', newSorter);
    set(sortersAtom, [...currentSorters, response.data]);
    set(messageAtom, { type: 'success', content: '정렬자가 추가되었습니다.' });
    message.success(`${newSorter.sorter_name}(이)가 추가되었습니다!`);
  } catch (error) {
    console.error('🚨 정렬자 추가 실패:', error);
    set(messageAtom, { type: 'error', content: '정렬자 추가에 실패했습니다.' });
    message.error("정렬자 추가 실패");
  }
});




// 정렬자 삭제
export const deleteSorterAction = atom(null, async (get, set, sorterIdToDelete) => {
  const currentSorters = get(sortersAtom);

  // 삭제할 정렬자의 인덱스를 찾음
  const indexToDelete = currentSorters.findIndex(s => s.sorter_id === sorterIdToDelete);

  if (indexToDelete === -1) {
    console.error('🚨 삭제할 정렬자를 찾을 수 없습니다:', sorterIdToDelete);
    set(messageAtom, { type: 'error', content: '삭제할 정렬자가 존재하지 않습니다.' });
    return;
  }

  const deletedSorter = currentSorters[indexToDelete];

  try {
    // 정렬자 삭제
    await axios.post('http://localhost:8080/api/sorter/delete', {
      sorter_id: deletedSorter.sorter_id,
    });

    // 남은 정렬자 리스트 재정렬
    const updated = currentSorters.filter((_, idx) => idx !== indexToDelete);
    const renamed = renumberSorters(updated);
    message.success(deletedSorter.sorter_name + "(이)가 삭제되었습니다!");
    // 백엔드에 재정렬 요청
    const reordered = await axios.post('http://localhost:8080/api/sorter/reorder', renamed);

    // 상태 업데이트
    set(sortersAtom, reordered.data);
    set(messageAtom, { type: 'success', content: '정렬자가 삭제되었습니다.' });
  } catch (error) {
    console.error('🚨 삭제 또는 재정렬 실패:', error);
    set(messageAtom, { type: 'error', content: '정렬자 삭제에 실패했습니다.' });
  }
});

export const fetchSortersByUserAction = atom(null, async (get, set) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/sorter/user/user123`);
    const data = response.data;


    set(sortersAtom, data);

  } catch (error) {
    console.error('🚨 사용자 정렬자 불러오기 실패:', error);

  }
});

export const updateSorterNameAction = atom(null, async (get, set, { sorter_id, newName }) => {
  try {
    await axios.put('http://localhost:8080/api/sorter/update-name', {
      sorter_id,
      sorter_name: newName,
    });

    const current = get(sortersAtom);
    const updated = current.map(s =>
        s.sorter_id === sorter_id ? { ...s, sorter_name: newName } : s
    );

    set(sortersAtom, updated);
    message.success("정렬자 이름이 수정되었습니다.");
    set(messageAtom, { type: 'success', content: '정렬자 이름 수정 완료' });
  } catch (err) {
    console.error('이름 수정 실패', err);
    message.error("정렬자 이름 수정 실패");
    set(messageAtom, { type: 'error', content: '정렬자 이름 수정 실패' });
  }
});

export const deleteMultipleSortersAction = atom(null, async (get, set, sorterIdsToDelete) => {
  const currentSorters = get(sortersAtom);

  // 삭제할 sorter가 없을 경우
  if (!Array.isArray(sorterIdsToDelete) || sorterIdsToDelete.length === 0) {
    message.warning("삭제할 정렬자를 선택해주세요.");
    return;
  }

  try {
    // 삭제 요청
    await axios.post('http://localhost:8080/api/sorter/delete/multiple', sorterIdsToDelete);

    // 삭제된 정렬자 이름 리스트
    const deletedNames = currentSorters
        .filter(s => sorterIdsToDelete.includes(s.sorter_id))
        .map(s => s.sorter_name)
        .join(', ');

    // 남은 정렬자 재정렬
    const updated = currentSorters.filter(s => !sorterIdsToDelete.includes(s.sorter_id));
    const renamed = renumberSorters(updated);
    const reordered = await axios.post('http://localhost:8080/api/sorter/reorder', renamed);

    // 상태 업데이트
    set(sortersAtom, reordered.data);
    message.success(`${deletedNames}(이)가 삭제되었습니다.`);
    set(messageAtom, { type: 'success', content: '정렬자가 삭제되었습니다.' });

  } catch (error) {
    console.error('🚨 다중 삭제 또는 재정렬 실패:', error);
    message.error("정렬자 다중 삭제에 실패했습니다.");
    set(messageAtom, { type: 'error', content: '정렬자 삭제 실패' });
  }
});

export const getElementNameByIdAction = atom(
    null,
    async (get, set, elementsId) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/elements/${elementsId}`);
        const elementName = response.data;  // 반환되는 데이터에서 `name`만 추출한다고 가정

        // element name을 atom에 설정합니다.
        set(elementNameAtom, elementName);  // elementNameAtom에 설정
        return elementName;
      } catch (error) {

        set(messageAtom, { type: 'error', content: 'elements_name 조회에 실패했습니다.' });

        return null;
      }
    }
);




export const getElementsIdBySorterNameAction = atom(
    null,
    async (_get, set, sorterName) => {
      try {
        // sorterName에 해당하는 elements_id 리스트를 가져오는 API 호출
        const response = await axios.get(`http://localhost:8080/api/sorter/element-id/${sorterName}`);
        const elementsIds = response.data; // 여러 개의 element-id 리스트

        // 여러 개의 elementsId를 출력

        set(messageAtom, { type: 'success', content: `elements_id 조회 성공: ${elementsIds.length}개의 element_id 조회됨.` });

        // 여러 개의 element_id 반환
        return elementsIds;
      } catch (error) {
        console.error('🚨 elements_id 조회 실패:', error);

        set(messageAtom, { type: 'error', content: 'elements_id 조회 실패' });
        return null;
      }
    }
);


export const moveElementToSorterAction = atom(null, async (get, set, { elementsNameId, sorterName }) => {
  const currentSorters = get(sortersAtom);

  try {
    // 1단계: 요소의 정보를 가져와서 elements_id를 얻음
    const response = await axios.get(`http://localhost:8080/api/elements/${elementsNameId}`);
    const element = response.data;

    if (!element) {
      set(messageAtom, { type: 'error', content: '요소를 찾을 수 없습니다.' });
      return;
    }

    const elementsId = element.elements_name_id; // 해당 요소의 elements_id

    // 2단계: sorter_name에 해당하는 sorterId를 찾기
    const selectedSorter = currentSorters.find(sorter => sorter.sorter_name === sorterName);

    if (!selectedSorter) {
      set(messageAtom, { type: 'error', content: '해당하는 정렬자를 찾을 수 없습니다.' });
      return;
    }

    const sorterId = selectedSorter.sorter_id;  // 선택된 정렬자의 ID

    // 3단계: 이미 요소가 해당 정렬자에 추가되어 있는지 확인
    const existingElementInSorter = await axios.get(`http://localhost:8080/api/sorter/${sorterId}/elements/${elementsId}`);

    if (existingElementInSorter.data.exists) {
      set(messageAtom, { type: 'error', content: '이미 해당 요소가 정렬자에 추가되어 있습니다.' });
      return;
    }

    const newSorter = {
      user_id: 'user123', // 로그인한 사용자 ID로 수정해야 함
      elements_id: elementsId, // 선택된 elements_id
      sorter_number: selectedSorter.sorter_number,  // 정렬자 번호는 선택된 정렬자의 번호
      sorter_name: selectedSorter.sorter_name, // 선택된 정렬자의 이름
    };

    // 4단계: 정렬자에 요소를 추가하는 요청
    const sorterResponse = await axios.post(`http://localhost:8080/api/sorter/name/${sorterName}/addElement`, newSorter);

    // 5단계: 새로운 정렬자 리스트 갱신
    set(sortersAtom, [...currentSorters, sorterResponse.data]);

    // 6단계: 사용자에게 성공 메시지 표시
    set(messageAtom, { type: 'success', content: '정렬자가 추가되었습니다.' });
    message.success(`정렬자 ${newSorter.sorter_name}(이)가 추가되었습니다!`);

  } catch (error) {
    console.error('🚨 정렬자 추가 실패:', error);
    set(messageAtom, { type: 'error', content: '정렬자 추가 실패' });
    message.error("정렬자 추가에 실패했습니다.");
  }
});
