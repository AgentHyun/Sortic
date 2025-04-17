import React, { useEffect ,useState } from "react";
import { useAtom } from 'jotai';
import {Button, Input, message, Modal} from 'antd';
import axios from 'axios';
import '../css/billPage.css';
import { billsAtom } from "../atom/atoms";

const BillPage = () => {
  const [bills, setBills] = useAtom(billsAtom);
  const userId = 'user123';
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBillName, setNewBillName] = useState('');
  useEffect(() => {
    axios.get(`http://localhost:8080/api/bills/getAllBills?userId=${userId}`)
      .then(res => setBills(res.data))
      .catch(err => {
        console.error('Bill 불러오기 실패:', err);
        message.error('계산서 목록을 불러오는 데 실패했습니다.');
      });
  }, [userId]);
  const handleAddBill = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/bills/addBill`,{
        billName : newBillName,
        userId  : userId
      });

      setBills([...bills,res.data]);
      setNewBillName('');
      setIsModalVisible(false);
      message.success("Bill이 추가되었습니다!");

    } catch (error){
      message.error("Bill 추가 실패")
    }

  }
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
          <div className="bill-title">{bill.billName}</div>
          <div>
            <h4>📦 항목</h4>
            <ul>
              {bill.elements.map((el, idx) => (
                <li key={idx}>{el.elementsName} - {el.elementsPrice}원</li>
              ))}
            </ul>
            <p><strong>총 요소 금액:</strong> {bill.totalElementPrice}원</p>
          </div>
          <div>
            <h4>🧾 수수료</h4>
            <ul>
              {bill.commissions.map((c, idx) => (
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
