import React, { useEffect, useState } from 'react';
import { X } from "lucide-react";
import publicAxios from '../../../api/publicAxios';
import '../css/delivery.css';
import { message, Select } from "antd";
import image1 from '../css/deliveryImage/delivery1.png';
import image2 from '../css/deliveryImage/delivery2.png';
import image3 from '../css/deliveryImage/delivery3.png';
import image4 from '../css/deliveryImage/delivery4.png';
import image5 from '../css/deliveryImage/delivery5.png';
const { Option } = Select;

const DeliveryTracking = ({ onClose }) => {
  const [position, setPosition] = useState({ x: -1000, y: -500 }); // 컴포넌트 초기 위치
  const [dragging, setDragging] = useState(false); // 드래그 상태
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // 드래그 위치 보정용 오프셋

  // 배송 단계별 이미지 및 설명
  const deliveryImages = [image1, image2, image3, image4, image5];
  const deliveryLevel = [['포탈 원소','수집 중'],['포탈 에너지',' 충전 중'],['포탈 게이트', '여는 중'],['포탈 좌표','설정 중'],['포탈 오픈!',' 상품 도착!']];

  // 택배사 목록 및 운송장 상태
  const [companyList, setCompanyList] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  const company = companyList.find(c => c.Code === selectedCode);
  const companyName = company?.Name || '알 수 없음';

  // 드래그 이동 처리
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

  // 택배사 목록 불러오기
  useEffect(() => {
    const fetchCompanyList = async () => {
      try {
        const res = await publicAxios.get('/delivery/getCompanyList');
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

  // 배송 조회 요청 처리
  const handleSearch = async () => {
    if (!selectedCode || !invoiceNumber) {
      message.error('택배사와 운송장 모두 입력하여 주십시오.');
      return;
    }
    try {
      const res = await publicAxios.post('/delivery/tracking', {
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
      {/* 헤더 (드래그 및 닫기) */}
      <div className="tracking-header" onMouseDown={handleMouseDown}>
        <span>배송조회</span>
        <X onClick={onClose} className="close-btn" />
      </div>

      <div className="tracking-body">
        {/* 조회 전 상태 */}
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
          // 조회 결과 상태
          <div className="portal-delivery-result">
            <div className="delivery-meta">
              <div className="delivery-top">운송장 번호</div>
              <div className="delivery-invoiceNo"> <strong>{trackingInfo.invoiceNo}</strong></div>
              <div className="delevery-company"><strong> {companyName}</strong></div>
            </div>

            {/* 배송 진행 상태 시각화 */}
            <div className="delivery-progress-bar">
              {deliveryLevel.map((label, idx) => (
                <div key={idx} className="progress-step">
                  <img
                    src={deliveryImages[idx]}
                    className={trackingInfo.level === idx + 2 ? 'active' : ''}
                  />
                  <div className="step-label">
                    {Array.isArray(label)
                      ? label.map((line, i) => (
                        <div key={i} className={trackingInfo.level === idx + 2 ? 'active' : ''}>{line}</div>
                      ))
                      : label}
                  </div>
                </div>
              ))}
            </div>

            {/* 배송 상세 타임라인 */}
            <div className="delivery-timeline">
              {Array.isArray(trackingInfo.trackingDetails) &&
                [...trackingInfo.trackingDetails].reverse().map((step, i) => (
                  <div key={i} className={`timeline-item ${i === 0 ? 'highlight' : ''}`}>
                    <div className="timeline-content">
                      <div className="timeline-txt">
                        <strong>{step.where}</strong> | <span className="status">{step.kind}</span>
                      </div>
                      <div className="time">{step.timeString}</div>
                    </div>
                  </div>
                ))}
            </div>

            {/* 다시 조회 버튼 */}
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
