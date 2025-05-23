import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { authUserAtom } from '../../auth/authAtoms';
import './css/StatisticsPage.css';
import { Button, Modal, message } from 'antd';

const { confirm } = Modal;

const StatisticsPage = () => {
  const [user] = useAtom(authUserAtom);
  const userId = user.userId;
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/order/received', { params: { userId } });
      setOrders(res.data);
    } catch (err) {
      console.error('주문 데이터 불러오기 실패:', err);
      message.error('주문 데이터를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    if (userId) fetchOrders();
  }, [userId]);

  const statusTextKor = {
    PENDING: '주문 대기',
    ACCEPTED: '주문 수락',
    CANCELED: '주문 취소',
    COMPLETED: '처리 완료'
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axios.put('/api/order/update-status', { orderId, status });
      message.success(`'${statusTextKor[status]}' 상태로 변경되었습니다.`);
      fetchOrders();
    } catch (err) {
      console.error('상태 변경 실패:', err);
      message.error('주문 상태 변경 실패');
    }
  };

  const showConfirm = (orderId, currentStatus, nextStatus) => {
    confirm({
      title: `'${statusTextKor[nextStatus]}' 처리할까요?`,
      content: `현재 상태: ${statusTextKor[currentStatus]}`,
      okText: '확인',
      cancelText: '취소',
      onOk: () => handleUpdateStatus(orderId, nextStatus)
    });
  };

  return (
    <div className="order-bill-slider-container">
      <div className="order-info">
        <h2 className="order-title">마우스를 올려 <span className="gold">영수증</span>을 조회해요</h2>
      </div>

      {orders.map((order, idx) => (
        <div key={idx} className="order-bill-container">
          <div className="flip-card">
            <div className="flip-card-inner">
              {/* FRONT */}
              <div className="flip-card-front">
                <p className="order-title">주문 번호: {order.orderId}</p>
                <p>주문자: {order.orderUserId}</p>
                <p>상태: {statusTextKor[order.orderStatus]}</p>
                <p>수수료: {order.wholesaleCommission.toLocaleString()}원</p>
              </div>

              {/* BACK */}
              <div className="flip-card-back">
                <p className="order-title">요소 목록</p>
                {order.elements.map((el, i) => (
                  <div key={i} className="order-element">
                    <p>{el.elementName} - {el.elementCount}개</p>
                    <p>{el.elementPrice.toLocaleString()}원</p>
                  </div>
                ))}

                {/* 버튼 분기 */}
                {order.orderStatus === 'PENDING' && (
                  <div style={{ marginTop: 10 }}>
                    <Button type="primary" onClick={() => showConfirm(order.orderId, 'PENDING', 'ACCEPTED')} style={{ marginRight: 8 }}>
                      주문 수락
                    </Button>
                    <Button danger onClick={() => showConfirm(order.orderId, 'PENDING', 'CANCELED')}>
                      주문 거절
                    </Button>
                  </div>
                )}

                {order.orderStatus === 'ACCEPTED' && (
                  <div style={{ marginTop: 10 }}>
                    <Button type="primary" onClick={() => showConfirm(order.orderId, 'ACCEPTED', 'COMPLETED')} style={{ marginRight: 8 }}>
                      처리 완료
                    </Button>
                    <Button danger onClick={() => showConfirm(order.orderId, 'ACCEPTED', 'CANCELED')}>
                      주문 취소
                    </Button>
                  </div>
                )}

                {(order.orderStatus === 'COMPLETED' || order.orderStatus === 'CANCELED') && (
                  <p style={{ fontWeight: 'bold', color: order.orderStatus === 'COMPLETED' ? 'green' : 'gray', marginTop: 10 }}>
                    ✅ {statusTextKor[order.orderStatus]}된 주문
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsPage;
