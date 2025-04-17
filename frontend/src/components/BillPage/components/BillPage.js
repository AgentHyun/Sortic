import React, { useEffect } from "react";
import { useAtom } from 'jotai';
import { message } from 'antd';
import axios from 'axios';
import '../css/billPage.css';
import { billsAtom } from "../atom/atoms";

const BillPage = () => {
  const [bills, setBills] = useAtom(billsAtom);
  const userId = 'user123';

  useEffect(() => {
    axios.get(`http://localhost:8080/api/bills/getAllBills?userId=${userId}`)
      .then(res => setBills(res.data))
      .catch(err => {
        console.error('Bill 불러오기 실패:', err);
        message.error('계산서 목록을 불러오는 데 실패했습니다.');
      });
  }, [userId]);

  return (
    <div className="bill-container">
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
    </div>
  );
};

export default BillPage;
