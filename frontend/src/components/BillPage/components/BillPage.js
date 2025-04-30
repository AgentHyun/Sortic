import React, { useEffect ,useState } from "react";
import { useAtom } from 'jotai';
import {Button, Input, message, Modal} from 'antd';
import apiAxios from '../../../Api/apiAxios'; // // ✅ 주소 수정 axios -> authAxios
import '../css/billPage.css';
import { billsAtom } from "../atom/atoms";
import {X} from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // ✅ JWT 디코딩을 위해 추가 설치 필요 (npm install jwt-decode)

const BillPage = () => {
  const [bills, setBills] = useAtom(billsAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBillName, setNewBillName] = useState('');

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
      .catch(err => message.error('Bill 불러오기 실패', err));
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

    } catch (error){
      message.error("Bill 추가 실패")
    }
  };

  /** ✅ Bill 삭제 처리 */
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
