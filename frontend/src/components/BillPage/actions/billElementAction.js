import axios from 'axios';
import { atom } from 'jotai';
import { message } from 'antd';
import { billElementsAtom, messageAtom, billsAtom } from '../atom/atoms'
import {selectedUserIdAtom} from "../../SorterPage/atoms/atoms";
import {wholesaleLinksAtom} from "../../WholesalePage/atoms/atoms";
import {authUserAtom} from "../../../auth/authAtoms"; // 적절한 atom을 가져옵니다.

// BillElement 추가
export const addBillElementAction = atom(
  null,
  async (get, set, billElementData) => {
    if (!billElementData?.billId || !billElementData?.elementsNameId) {
      set(messageAtom, {
        type: 'warning',
        content: 'Bill ID와 요소 정보가 필요합니다.',
      });
      message.warning('Bill ID와 요소 정보가 필요합니다.');
      return;
    }


    const bills = get(billsAtom); // 모든 bill
    const targetBill = bills.find((bill) => bill.billId === billElementData.billId);

    if (!targetBill) {
      set(messageAtom, {
        type: 'warning',
        content: '해당 Bill을 찾을 수 없습니다.',
      });
      message.warning('해당 Bill을 찾을 수 없습니다.');
      return;
    }

    const isDuplicate = targetBill.elements?.some(
      (element) => element.elementsNameId === billElementData.elementsNameId
    );


    if (isDuplicate) {
      set(messageAtom, {
        type: 'warning',
        content: '해당 Bill에 이미 포함된 요소입니다.',
      });
      message.warning('해당 Bill에 이미 포함된 요소입니다.');
      return;
    }

    try {
      console.log('보낼 데이터', JSON.stringify(billElementData, null, 2));

      const response = await axios.post(
        'http://localhost:8080/api/bill-elements/add',
        billElementData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        set(billElementsAtom, (prev) => [...prev, response.data]);
        set(messageAtom, {
          type: 'success',
          content: 'BillElement가 성공적으로 추가되었습니다!',
        });
        message.success('BillElement 추가 성공!');


      } else {
        set(messageAtom, {
          type: 'warning',
          content: 'BillElement 추가 실패',
        });
        message.error('BillElement 추가 실패!');
      }
    } catch (error) {
      console.error('BillElement 추가 실패:', error);
      set(messageAtom, {
        type: 'warning',
        content: 'BillElement 추가 중 오류가 발생했습니다.',
      });
      message.error('오류 발생!');
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

    // 여러 bill 중복 방지를 위해 현재 상태 확인
    const bills = get(billsAtom);

    // 중복 필터링
    const filtered = billElementsData.filter((newEl) => {
      const targetBill = bills.find((bill) => bill.billId === newEl.billId);
      if (!targetBill) return false; // 일치하는 bill이 없으면 그냥 제외
      const isDuplicate = targetBill.elements?.some(
        (el) => el.elementsNameId === newEl.elementsNameId
      );
      return !isDuplicate; // 중복이 아니어야 통과
    });

    if (filtered.length === 0) {
      set(messageAtom, {
        type: 'warning',
        content: '추가할 요소가 모두 이미 포함되어 있습니다.',
      });
      message.warning('중복된 요소로 인해 추가할 수 없습니다.');
      return;
    }

    try {
      console.log("보낼 데이터", JSON.stringify(filtered, null, 2));

      const response = await axios.post(
        'http://localhost:8080/api/bill-elements/add-multiple',
        filtered,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        set(billElementsAtom, (prevBillElements) => [
          ...prevBillElements,
          ...response.data,
        ]);

        set(messageAtom, {
          type: 'success',
          content: 'BillElements가 성공적으로 추가되었습니다!',
        });
        message.success("BillElements 추가 성공!");
      } else {
        set(messageAtom, {
          type: 'warning',
          content: 'BillElements 추가 실패',
        });
        message.error("BillElements 추가 실패!");
      }
    } catch (error) {
      console.error('BillElements 추가 실패:', error);
      set(messageAtom, {
        type: 'warning',
        content: 'BillElements 추가 중 오류가 발생했습니다.',
      });
      message.error("오류 발생!");
    }
  }
);

export const fetchBillsAction = atom(null,async (get,set)=>{
  const wholesaleLink = get(wholesaleLinksAtom);
  const user = get(authUserAtom);
  const userId = user.userId;
    console.log(wholesaleLink.wholesaleLinkId)
    axios.get(`http://localhost:8080/api/bills/getAllBills?userId=${userId}&wholesaleLinkId=${wholesaleLink.wholesaleLinkId}`) // ✅ 주소 수정
      .then(res => set(billsAtom,res.data))
      .catch(err => console.error('Bill 불러오기 실패', err));

});
