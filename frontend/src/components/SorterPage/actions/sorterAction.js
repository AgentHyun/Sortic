import { atom } from 'jotai';
import axios from 'axios';
import { sortersAtom, messageAtom } from '../atoms/atoms';
import { message } from 'antd';
// sorter_number와 sorter_name 재정렬 함수


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

    console.log(data);
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

