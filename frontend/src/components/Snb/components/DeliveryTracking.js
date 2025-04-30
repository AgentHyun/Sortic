import React, { useEffect, useState } from 'react';
import { X } from "lucide-react";
import axios from 'axios';
import '../css/delivery.css';
import { message, Select } from "antd";
const { Option } = Select;

const DeliveryTracking = ({ onClose }) => {
  const [position, setPosition] = useState({ x: -800, y: -500 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const deliveryLevel = ['원소 수집 중','에너지 충전 중','게이트 여는 중','좌표 설정 중','포탈 오픈 완료!'+'상품 도착!']

  const [companyList, setCompanyList] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };

    const handleMouseUp = () => setDragging(false);

    if (dragging) {
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.userSelect = 'auto';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const fetchCompanyList = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/delivery/getCompanyList');
        const companies = res.data.Company || res.data.company || res.data;
        setCompanyList(companies);
      } catch (err) {
        console.error(err);
        alert('택배사 목록 불러오기 실패');
      }
    };
    fetchCompanyList();
  }, []);

  const handleInvoiceChange = (e) => {
    setInvoiceNumber(e.target.value);
  };

  const handleSearch = async () => {
    if (!selectedCode || !invoiceNumber) {
      message.error('택배사와 운송장 모두 입력하여 주십시오.');
      return;
    }
    try {
      const res = await axios.post('http://localhost:8080/api/delivery/tracking', {
        code: selectedCode,
        invoice: invoiceNumber,
      });
      const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;

      if (parsed.result !== 'Y') {
        message.error('조회 실패: 운송장 번호 또는 택배사를 다시 확인해주세요.');
        return;
      }

      setTrackingInfo(parsed);
      message.success('조회 성공!');
    } catch (err) {
      console.error('조회 실패', err);
      message.error('조회 실패');
    }
  };

  return (
    <div
      className="tracking-container"
      style={{ left: position.x, top: position.y, position: 'absolute' }}
    >
      <div className="tracking-header" onMouseDown={handleMouseDown}>
        <span>배송조회</span>
        <X onClick={onClose} className="close-btn" />
      </div>

      <div className="tracking-body">
        {trackingInfo === null ? (
          <>
            <div className="input-group">
              <Select
                value={selectedCode || undefined}
                onChange={(value) => setSelectedCode(value)}
                placeholder="택배사를 선택하세요"
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="children"
              >
                {companyList.map((company) => (
                  <Option key={company.Code} value={company.Code}>
                    {company.Name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="운송장 번호를 입력하세요"
                value={invoiceNumber}
                onChange={handleInvoiceChange}
                className="input-field"
              />
            </div>

            <div className="button-group">
              <button onClick={handleSearch} className="search-btn">
                조회
              </button>
            </div>
          </>
        ) : (
          <div className="portal-delivery-result">
            <div className="delivery-meta">
              <div>운송장<p/> <strong>{trackingInfo.invoiceNo}</strong></div>
              <div><strong>상품명:</strong> {trackingInfo.itemName}</div>
              <div><strong>현재상태:</strong> {trackingInfo.lastStateDetail?.kind}</div>
              <div><strong>현재위치:</strong> {trackingInfo.lastStateDetail?.where}</div>
            </div>

            <div className="delivery-progress-bar">
              {deliveryLevel.map((label, idx) => (
                <div key={idx} className="progress-step">
                  <img
                    src={''}
                    className={trackingInfo.level >= idx + 1 ? 'active' : ''}
                  />
                  <div className="step-label">{label}</div>
                </div>
              ))}
            </div>

            <div className="delivery-timeline">
              {Array.isArray(trackingInfo.trackingDetails) &&
                [...trackingInfo.trackingDetails].reverse().map((step, i) => (
                  <div key={i} className="timeline-item">
                    <div className="dot" />
                    <div className="timeline-content">
                      <div><strong>{step.where}</strong> | {step.kind}</div>
                      <div className="time"> {step.timeString}</div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="button-group">
              <button onClick={() => setTrackingInfo(null)} className="search-btn">
                ← 다시 조회하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTracking;
