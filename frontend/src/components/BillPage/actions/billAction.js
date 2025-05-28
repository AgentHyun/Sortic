import { atom } from 'jotai';
import authAxios from '../../../axios/authAxios';
import { message } from 'antd';

// Bill 목록을 가져오는 액션
export const fetchBillsAction = atom(
  null,
  async (get, set, userId) => {
    try {
      if (!userId) {
        message.warning('로그인이 필요합니다.');
        return [];
      }
      const response = await authAxios.get(`/bills/getAllBills?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Bill 불러오기 실패:', error);
      message.error('Bill을 불러오는데 실패했습니다.');
      return [];
    }
  }
);

// Bill 추가 액션
export const addBillAction = atom(
  null,
  async (get, set, { billName, userId }) => {
    try {
      if (!userId) {
        message.warning('로그인이 필요합니다.');
        return;
      }
      await authAxios.post('/bills/addBill', {
        billName,
        user_id: userId
      });
      message.success('Bill이 추가되었습니다.');
      return true;
    } catch (error) {
      console.error('Bill 추가 실패:', error);
      message.error('Bill 추가에 실패했습니다.');
      return false;
    }
  }
);

// Bill 삭제 액션
export const deleteBillAction = atom(
  null,
  async (get, set, billId) => {
    try {
      await authAxios.delete('/bills/deleteBill', {
        params: { billId }
      });
      message.success('Bill이 삭제되었습니다.');
      return true;
    } catch (error) {
      console.error('Bill 삭제 실패:', error);
      message.error('Bill 삭제에 실패했습니다.');
      return false;
    }
  }
);

// Bill 이름 수정 액션
export const updateBillNameAction = atom(
  null,
  async (get, set, { billId, billName }) => {
    try {
      await authAxios.put('/bills/updateBillName', {
        billId,
        billName
      });
      message.success('Bill 이름이 수정되었습니다.');
      return true;
    } catch (error) {
      console.error('Bill 이름 수정 실패:', error);
      message.error('Bill 이름 수정에 실패했습니다.');
      return false;
    }
  }
);
