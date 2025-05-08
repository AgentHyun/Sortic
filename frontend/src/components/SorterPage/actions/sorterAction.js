import { atom } from 'jotai';
import axios from 'axios';
import {
  sortersAtom,
  messageAtom,
  elementNameAtom,
  elementsIdListAtom,
  sorterCardsAtom,
  selectedSortersAtom,
  sorterNameByIdAtom,
} from '../atoms/atoms';
import { message } from 'antd';
import { authUserAtom } from '../../../auth/authAtoms';
export const addingElementIdsBySorterAtom = atom({});
// 정렬자 번호 재정렬 함수
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
  const authUser = get(authUserAtom);
  const userId = authUser?.userId;
  const newSorter = {
    user_id: userId, // 실제 로그인한 유저 ID로 바꿔야 함
    sorter_number: currentSorters.length + 1,
    sorter_name: `sorter${currentSorters.length + 1}`,
  };

  try {
    // 정렬자 추가 요청
    const response = await axios.post('http://localhost:8080/api/sorter/add', newSorter);

    // 서버에서 최신 정렬자 목록을 가져와서 상태 업데이트
    const updatedSortersResponse = await axios.get(`http://localhost:8080/api/sorter/user/${userId}`);
    const updatedSorters = updatedSortersResponse.data;

    set(sortersAtom, updatedSorters);
    set(messageAtom, { type: 'success', content: '정렬자가 추가되었습니다.' });
    message.success(`${newSorter.sorter_name}(이)가 추가되었습니다!`);

  } catch (error) {
    console.error('🚨 정렬자 추가 실패:', error);
    set(messageAtom, { type: 'error', content: '정렬자 추가에 실패했습니다.' });
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

// 사용자별 정렬자 목록 불러오기
export const fetchSortersByUserAction = atom(null, async (get, set) => {
  const authUser = get(authUserAtom);
  const userId = authUser?.userId;

  try {
    const response = await axios.get(`http://localhost:8080/api/sorter/user/${userId}`);
    set(sortersAtom, response.data);
  } catch (error) {
    console.error('🚨 사용자 정렬자 불러오기 실패:', error);
  }
});

// 정렬자 이름 수정
export const updateSorterNameAction = atom(null, async (get, set, { oldSorterName, newName }) => {
  try {
    const response = await axios.put('http://localhost:8080/api/sorter/update', {
      oldSorterName,
      sorterName: newName,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const updatedSorters = response.data; // 서버에서 반환된 새로운 sorter 리스트
    const current = get(sortersAtom);

    // 기존 sortersAtom에서 oldSorterName이 있는 항목들을 모두 제거하고,
    // 서버에서 받은 새 sorter 리스트를 추가
    const filtered = current.filter(s => s.sorter_name !== oldSorterName);
    const merged = [...filtered, ...updatedSorters];

    set(sortersAtom, merged);
    message.success("정렬자 이름이 수정되었습니다.");
    set(messageAtom, { type: 'success', content: '정렬자 이름 수정 완료' });
  } catch (err) {
    console.error('이름 수정 실패', err);
    message.error("정렬자 이름 수정 실패");
    set(messageAtom, { type: 'error', content: '정렬자 이름 수정 실패' });
  }
});

// 다중 정렬자 삭제
export const deleteMultipleSortersAction = atom(null, async (get, set, sorterIdsToDelete) => {
  const currentSorters = get(sortersAtom);
  const authUser = get(authUserAtom);
  const userId = authUser?.userId;

  if (!Array.isArray(sorterIdsToDelete) || sorterIdsToDelete.length === 0) {
    message.warning("삭제할 정렬자를 선택해주세요.");
    return;
  }

  try {
    await axios.post('http://localhost:8080/api/sorter/delete/multiple', sorterIdsToDelete);

    const deletedNames = currentSorters
      .filter(s => sorterIdsToDelete.includes(s.sorter_id))
      .map(s => s.sorter_name)
      .join(', ');

    const updated = currentSorters.filter(s => !sorterIdsToDelete.includes(s.sorter_id));
    const renamed = renumberSorters(updated);
    const renamedWithUserId = renamed.map(sorter => ({
      ...sorter,
      user_id: sorter.user_id || userId,
    }));

    const reordered = await axios.post('http://localhost:8080/api/sorter/reorder', renamedWithUserId);

    set(sortersAtom, reordered.data);
    message.success(`${deletedNames}(이)가 삭제되었습니다.`);
    set(messageAtom, { type: 'success', content: '정렬자가 삭제되었습니다.' });
    set(selectedSortersAtom, []);
  } catch (error) {
    console.error('🚨 다중 삭제 또는 재정렬 실패:', error);
    message.error("정렬자 다중 삭제에 실패했습니다.");
    set(messageAtom, { type: 'error', content: '정렬자 삭제 실패' });
  }
});


// 요소 이름 불러오기
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

// 정렬자 ID 가져오기
export const getSorterIdByNameAndElementIdAction = atom(
  null,
  async (get, set, { sorterName, elementsId }) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/sorter/get-sorter-id`, {
        params: {
          sorterName,
          elementsId
        }
      });

      const sorterId = response.data;  // 반환된 sorter_id

      set(sorterCardsAtom, sorterId);
      message.success(`sorter_id 조회 성공: ${sorterId} 조회됨.`);
      return sorterId;

    } catch (error) {
      console.error('🚨 sorter_id 조회 실패:', error);
      set(messageAtom, { type: 'error', content: 'sorter_id 조회 실패' });
      message.error("sorter_id 조회에 실패했습니다.");
      return null;
    }
  }
);

export const moveElementToSorterAction = atom(
  null,
  async (get, set, { elementsId, sorterId }) => {
    let prevent = false;

    // 동기적으로 바로 업데이트
    set(addingElementIdsBySorterAtom, (prev) => {
      const already = prev[sorterId]?.includes(elementsId);
      if (already) {
        prevent = true;
        return prev;
      }

      return {
        ...prev,
        [sorterId]: [...(prev[sorterId] || []), elementsId],
      };
    });

    if (prevent) {
      message.warning("이미 추가 중인 요소입니다.");
      return;
    }

    try {
      const currentSorters = get(sortersAtom);
      const targetSorter = currentSorters.find(sorter => sorter.sorter_id === sorterId);
      const alreadyExists = targetSorter?.elements_id?.includes(elementsId);

      if (alreadyExists) {

        return;
      }

      await axios.post(
        `http://localhost:8080/api/sorter-element/add?sorterId=${sorterId}&elementId=${elementsId}`
      );

      const updatedSorters = currentSorters.map(sorter =>
        sorter.sorter_id === sorterId
          ? {
            ...sorter,
            elements_id: [...(sorter.elements_id || []), elementsId],
          }
          : sorter
      );

      set(sortersAtom, updatedSorters);
      message.success(`요소가 정렬자에 추가되었습니다!`);
    } catch (error) {
      if (error.response?.status === 409) {

      } else {
        console.error('🚨 요소 추가 실패:', error);
        message.error("요소 추가에 실패했습니다.");
      }
    } finally {
      set(addingElementIdsBySorterAtom, (prev) => ({
        ...prev,
        [sorterId]: (prev[sorterId] || []).filter(id => id !== elementsId),
      }));
    }
  }
);




// 정렬자 ID에 해당하는 모든 요소 ID 가져오기
export const getElementsIdBySorterIdAction = atom(
  null,
  async (get, set, sorterId) => {
    try {
      // 수정된 API 경로 사용
      const response = await axios.get(`http://localhost:8080/api/sorter-element/sorter/${sorterId}`);
      const elementsIds = response.data;  // 요소 ID 배열
      // 요소 ID 리스트를 상태에 저장
      set(elementsIdListAtom, elementsIds);

      return elementsIds;
    } catch (error) {
      console.error('🚨 요소 ID 조회 실패:', error);
      set(messageAtom, { type: 'error', content: '요소 ID 조회 실패' });
      message.error("요소 ID 조회에 실패했습니다.");
      return null;
    }
  }
);

export const getSorterNameByIdAction = atom(
  null,
  async (get, set, sorterId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/sorter/name/${sorterId}`);
      const sorterName = response.data; // 서버에서 반환된 sorter 이름

      // 가져온 sorter 이름을 상태에 설정
      set(sorterNameByIdAtom, sorterName);


    } catch (error) {
      console.error('🚨 정렬자 이름 조회 실패:', error);
      set(sorterNameByIdAtom, ''); // 실패 시 상태를 초기화
      message.error("정렬자 이름 조회에 실패했습니다.");
    }
  }
);
