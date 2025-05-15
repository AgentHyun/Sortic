import publicAxios from '../../../api/publicAxios';
import { atom } from 'jotai';
import { message } from 'antd';
import { billElementsAtom, messageAtom, billsAtom } from '../atom/atoms'
import {selectedUserIdAtom} from "../../SorterPage/atoms/atoms"; // 적절한 atom을 가져옵니다.

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

      const response = await publicAxios.post('/bill-elements/add', billElementData, {
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
export const addBillElementsAction = atom(
  null,
  async (get, set, billElementsData) => {
    if (!billElementsData || billElementsData.length === 0) {
      set(messageAtom, { type: 'warning', content: '올바른 BillElement 데이터를 입력하세요.' });
      return;
    }

    try {
      console.log("보낼 데이터", JSON.stringify(billElementsData, null, 2));
      // 여러 BillElement를 한 번에 보낼 데이터로 변환합니다.

      const response = await publicAxios.post('/bill-elements/add-multiple', billElementsData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data) {
        // 새로 추가된 BillElements를 상태에 업데이트
        set(billElementsAtom, (prevBillElements) => [
          ...prevBillElements,
          ...response.data, // 다중 추가된 BillElement들을 배열로 업데이트
        ]);

        set(messageAtom, { type: 'success', content: 'BillElements가 성공적으로 추가되었습니다!' });
        message.success("BillElements 추가 성공!");
      } else {
        set(messageAtom, { type: 'warning', content: 'BillElements 추가 실패' });
        message.error("BillElements 추가 실패!");
      }
    } catch (error) {
      console.error('BillElements 추가 실패:', error);
      set(messageAtom, { type: 'warning', content: 'BillElements 추가 중 오류가 발생했습니다.' });
      message.error("오류 발생!");
    }
  }
);
export const fetchBillsAction = atom(
  null,
  async (get, set, userId) => {
    try {
      const res = await publicAxios.get(`/bills/getAllBills?userId=${userId}`);
      set(billsAtom, res.data);
    } catch (err) {
      console.error('📛 Bill 불러오기 실패:', err);
    }
  }
);
