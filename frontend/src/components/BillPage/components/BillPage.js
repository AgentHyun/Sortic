import React, { useEffect ,useState } from "react";
import { useAtom } from 'jotai';
import {Button, Input, message, Modal} from 'antd';
import axios from 'axios';
import '../css/billPage.css';
import { billsAtom } from "../atom/atoms";
import {Trash,X} from 'lucide-react';
const BillPage = () => {
  const [bills, setBills] = useAtom(billsAtom);
  const userId = 'user123';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBillName, setNewBillName] = useState('');
  const fetchBills = () => {
    axios.get(`http://localhost:8080/api/bills/getAllBills?userId=${userId}`)
      .then(res => setBills(res.data))
      .catch(err => message.error('Bill 불러오기 실패', err));
  };

  useEffect(() => {
    fetchBills();
  }, [userId]);

  const handleAddBill = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/bills/addBill`,{
        billName : newBillName,
        userId  : userId
      });
      // 전체 Bill 다시 불러오기
      fetchBills();
      setNewBillName('');
      setIsModalVisible(false);
      message.success("Bill이 추가되었습니다!");

    } catch (error){
      message.error("Bill 추가 실패")
    }

  }
  const handleDeleteBill = async (billId) => {
    try {
      await axios.delete(`http://localhost:8080/api/bills/deleteBill`, {
        params: { billId }
      });
      message.success("삭제 완료!");
      fetchBills(); // 전체 새로고침
    } catch (err) {
      message.error("삭제 실패");
    }
  };
  return (

    <div className="bill-container">
      {/* 👉 상단 버튼 */}
      <div className="bill-add">
        <Button type="primary" className="add-bill-btn" onClick={() => setIsModalVisible(true)}>
          + Bill 추가하기
        </Button>
      </div>
      {bills.map((bill) => (
        <div key={bill.billId} className="bill-box">
          {/* X 아이콘은 위에 절대 위치로 */}
          <X
            className="delete-icon"
            onClick={() => handleDeleteBill(bill.billId)}
          />
          {/* 제목은 가운데 정렬 */}
          <div className="bill-title">
            {bill.billName}
          </div>

          <div>
            <h4>📦 항목</h4>
            <ul>
              {Array.isArray(bill.elements) && bill.elements.map((el, idx) => (
                <li key={idx}>{el.elementsName} - {el.elementsPrice}원</li>
              ))}
            </ul>
            <p><strong>총 요소 금액:</strong> {bill.totalElementPrice}원</p>
          </div>
          <div>
            <h4>🧾 수수료</h4>
            <ul>
              {Array.isArray(bill.commissions) &&bill.commissions.map((c, idx) => (
                <li key={idx}>{c.commissionName} - {c.commission}원</li>
              ))}
            </ul>
            <p><strong>총 수수료:</strong> {bill.totalCommission}원</p>
          </div>
          <div>
            <p><strong>총합:</strong> {bill.grandTotal}원</p>
          </div>
        </div>
      ))}
      {/* 👉 모달 */}
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
