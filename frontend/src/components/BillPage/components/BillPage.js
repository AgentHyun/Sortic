import React, { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import { Button, Input, message, Modal } from 'antd';
import axios from 'axios'; // 임시 apiAxios로 변경해야함
import apiAxios from '../../../Api/apiAxios'; // ✅ 주소 수정 axios -> authAxios
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'; // useSortable import 제거
import { billsAtom } from "../atom/atoms";
import '../css/billPage.css';
import DroppableBillBox from './DroppableBillBox';  // DroppableBillBox import
import { jwtDecode } from 'jwt-decode'; // ✅ JWT 디코딩을 위해 추가 설치 필요 (npm install jwt-decode)
import { authUserAtom } from '../../../auth/authAtoms';
import { fetchBillsAction } from '../actions/billAction';

const BillPage = () => {
  const [bills, setBills] = useAtom(billsAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBillName, setNewBillName] = useState('');
  const [editingBillId, setEditingBillId] = useState(null);
  const [editedBillName, setEditedBillName] = useState('');
  const [authUser] = useAtom(authUserAtom);
  const [, setFetchBills] = useAtom(fetchBillsAction);

  /** ✅ JWT에서 userId 추출 */
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const decoded = jwtDecode(token); // { userId: 'test', sub: ..., iat: ..., exp: ... }
      return decoded.userId;
    } catch (err) {
      message.error('로그인 정보가 유효하지 않습니다.');
      return null;
    }
  };

  const user_id = getUserIdFromToken(); // ✅ 실제 로그인된 사용자 ID

  /** 💡 모든 Bill 목록 가져오기 */
  const fetchBills = () => {
    apiAxios.get(`/bills/getAllBills?user_id=${user_id}`) // ✅ 주소 수정
      .then(res => setBills(res.data))
      .catch(err => console.error('Bill 불러오기 실패', err));
  };

  useEffect(() => {
    const loadBills = async () => {
      if (!authUser?.userId) {
        message.warning('로그인이 필요합니다.');
        return;
      }
      try {
        await setFetchBills(authUser.userId);
      } catch (error) {
        console.error('Bill 불러오기 실패', error);
        message.error('Bill을 불러오는데 실패했습니다.');
      }
    };
    loadBills();
  }, [authUser, setFetchBills]);

  /** ✅ Bill 추가 처리 */
  const handleAddBill = async () => {
    if (!newBillName.trim()) {
      message.warning('Bill 이름을 입력해주세요.');
      return;
    }
    if (!authUser?.userId) {
      message.warning('로그인이 필요합니다.');
      return;
    }
    try {
      await apiAxios.post(`/bills/addBill`,{ // ✅ 주소 수정
        billName : newBillName,
        user_id  : user_id
      });
      // 전체 Bill 다시 불러오기
      await setFetchBills(authUser.userId);
      setNewBillName('');
      setIsModalVisible(false);
      message.success("Bill이 추가되었습니다!");
    } catch (error) {
      console.error("Bill 추가 실패", error);
      message.error("Bill 추가에 실패했습니다.");
    }
  };

  const handleDeleteBill = async (billId) => {
    try {
      await apiAxios.delete(`/bills/deleteBill`, { // ✅ 주소 수정
        params: { billId }
      });
      message.success("삭제 완료!");
      await setFetchBills(authUser.userId);
    } catch (error) {
      console.error('Bill 삭제 실패', error);
      message.error('Bill 삭제에 실패했습니다.');
    }
  };

  const handleUpdateBillName = async (billId, newName) => {
    if (!newName.trim()) {
      message.warning('Bill 이름을 입력해주세요.');
      return;
    }
    try {
      await apiAxios.put('/bills/updateBillName', {
        billId: billId,
        billName: newName,
      });
      message.success("Bill 이름 수정 성공");
      setEditingBillId(null);
      setEditedBillName('');
      await setFetchBills(authUser.userId);
    } catch (error) {
      console.error('Bill 이름 업데이트 실패', error);
      message.error('Bill 이름 업데이트에 실패했습니다.');
    }
  };

  return (
    <div className="bill-container">
      <div className="bill-add">
        <Button type="primary" className="add-bill-btn" onClick={() => setIsModalVisible(true)}>
          + Bill
        </Button>
      </div>

      <SortableContext
        items={bills.map(bill => bill.billId)} // bills의 ID로 SortableContext 구성
        strategy={rectSortingStrategy}
      >
        {bills.map((bill) => (
          <DroppableBillBox
            key={bill.billId}
            bill={bill}
            onDelete={handleDeleteBill}
            isEditing={editingBillId === bill.billId}
            onEditStart={(id, name) => {
              setEditingBillId(id);
              setEditedBillName(name);
            }}
            onEditSubmit={handleUpdateBillName}
            editedName={editedBillName}
            onEditNameChange={(e) => setEditedBillName(e.target.value)}
          />
        ))}
      </SortableContext>

      <Modal
        title="새로운 Bill 추가"
        open={isModalVisible}
        onOk={handleAddBill}
        onCancel={() => setIsModalVisible(false)}
        okText="추가"
        cancelText="취소"
      >
        <Input
          placeholder="Bill 이름을 입력하세요"
          value={newBillName}
          onChange={(e) => setNewBillName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default BillPage;
