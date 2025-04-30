import React, { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import { Button, Input, message, Modal } from 'antd';
import axios from 'axios';
import { Trash, X, Plus } from 'lucide-react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'; // useSortable import 제거
import { billsAtom } from "../atom/atoms";
import '../css/billPage.css';
import DroppableBillBox from './DroppableBillBox';  // DroppableBillBox import

const BillPage = () => {
  const [bills, setBills] = useAtom(billsAtom);
  const userId = 'user123';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBillName, setNewBillName] = useState('');
  const [editingBillId, setEditingBillId] = useState(false);
  const [editedBillName, setEditedBillName] = useState('');

  const fetchBills = () => {
    axios.get(`http://localhost:8080/api/bills/getAllBills?userId=${userId}`)
      .then(res => setBills(res.data))
      .catch(err => console.error('Bill 불러오기 실패', err));
  };

  useEffect(() => {
    fetchBills();
  }, [userId]);

  const handleAddBill = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/bills/addBill`, {
        billName: newBillName,
        userId: userId
      });
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
      await axios.delete(`http://localhost:8080/api/bills/deleteBill`, {
        params: { billId }
      });
      message.success("삭제 완료!");
      fetchBills();
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
