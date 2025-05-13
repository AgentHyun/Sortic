import React, { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import { Button, Input, message, Modal } from 'antd';
import axios from 'axios'; // 임시 apiAxios로 변경해야함
import apiAxios from '../../../Api/apiAxios'; // ✅ 주소 수정 axios -> authAxios
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'; // useSortable import 제거
import { billsAtom } from "../atom/atoms";
import '../css/billPage.css';
import DroppableBillBox from './DroppableBillBox';  // DroppableBillBox import
import { jwtDecode } from 'jwt-decode';
import {selectedUserIdAtom} from "../../SorterPage/atoms/atoms"; // ✅ JWT 디코딩을 위해 추가 설치 필요 (npm install jwt-decode)

const BillPage = () => {
  const [bills, setBills] = useAtom(billsAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBillName, setNewBillName] = useState('');
  const [editingBillId, setEditingBillId] = useState(false);
  const [editedBillName, setEditedBillName] = useState('');
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdAtom);

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

  const user_id = selectedUserId; // ✅ 실제 로그인된 사용자 ID

  /** 💡 모든 Bill 목록 가져오기 */
  const fetchBills = () => {
    apiAxios.get(`/bills/getAllBills?user_id=${user_id}`) // ✅ 주소 수정
      .then(res => setBills(res.data))
      .catch(err => console.error('Bill 불러오기 실패', err));
  };

  useEffect(() => {
    fetchBills();
  }, []);

  /** ✅ Bill 추가 처리 */
  const handleAddBill = async () => {
    try {


      await apiAxios.post(`/bills/addBill`,{ // ✅ 주소 수정
        billName : newBillName,
        user_id  : user_id
      });
      // 전체 Bill 다시 불러오기
      fetchBills();
      setNewBillName('');
      setIsModalVisible(false);
      message.success("Bill이 추가되었습니다!");
    } catch (error) {
      console.error("Bill 추가 실패");
    }
  };

  const handleDeleteBill = async (billId) => {
    try {
      await apiAxios.delete(`/bills/deleteBill`, { // ✅ 주소 수정
        params: { billId }
      });
      message.success("삭제 완료!");
      fetchBills(); // 전체 새로고침
    } catch (err) {
      message.error("삭제 실패");
    }
  };

  const handleUpdateBillName = async (billId) => {
    try {
      await axios.put(`http://localhost:8080/api/bills/updateBillName`, {
        billId: billId,
        billName: editedBillName,
      });
      message.success("Bill 이름 수정 성공");
      setEditingBillId(null);
      fetchBills();
    } catch (err) {
      message.error("Bill 이름 수정 실패");
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
