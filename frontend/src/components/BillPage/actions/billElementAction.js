import axios from 'axios';
import { atom } from 'jotai';
import { message } from 'antd';
import { billElementsAtom, messageAtom } from '../atom/atoms' // 적절한 atom을 가져옵니다.

// BillElement 추가
export const addBillElementAction = atom(
  null,
  async (get, set, billElementData) => {
    if (!billElementData) {
      set(messageAtom, { type: 'warning', content: '올바른 BillElement 데이터를 입력하세요.' });
      return;
    }

    try {

      console.log("보낼 데이터", JSON.stringify(billElementData, null, 2));
// 이 값을 콘솔에 찍어보세요.

      const response = await axios.post('http://localhost:8080/api/bill-elements/add', billElementData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        // 새로 추가된 BillElement를 상태에 업데이트
        set(billElementsAtom, (prevBillElements) => [...prevBillElements, response.data]);

        set(messageAtom, { type: 'success', content: 'BillElement가 성공적으로 추가되었습니다!' });
        message.success("BillElement 추가 성공!");
      } else {
        set(messageAtom, { type: 'warning', content: 'BillElement 추가 실패' });
        message.error("BillElement 추가 실패!");
      }
    } catch (error) {
      console.error('BillElement 추가 실패:', error);
      set(messageAtom, { type: 'warning', content: 'BillElement 추가 중 오류가 발생했습니다.' });
      message.error("오류 발생!");
    }
  }
);
