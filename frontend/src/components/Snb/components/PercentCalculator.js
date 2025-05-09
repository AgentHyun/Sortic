import React, { useEffect, useState } from 'react';
import { X } from "lucide-react";
import '../css/percent.css';

const PercentCalculator = ({ onClose }) => {
  // 초기 위치는 오른쪽 아래 고정된 컴포넌트 기준으로 세팅
  const [position, setPosition] = useState({ x: -1000, y: -500 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [results, setResults] = useState(["", "", "", ""]); // 각 계산 결과 저장

  // 드래그 이동 처리
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

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

  // 계산 실행 핸들러 (type에 따라 계산 방식 다름)
  const handleCalculate = (type, index) => {
    const inputs = document.querySelectorAll(".calc-block")[index].querySelectorAll("input");

    const v1 = parseFloat(inputs[0].value);
    const v2 = parseFloat(inputs[1].value);

    if (isNaN(v1) || isNaN(v2)) {
      setResults(prev => {
        const copy = [...prev];
        copy[index] = "입력오류";
        return copy;
      });
      return;
    }

    let result = "";
    switch (type) {
      case 1:
        result = parseFloat((v1 * v2 / 100).toFixed(2)); // A의 B%는?
        break;
      case 2:
        result = parseFloat((v2 / v1 * 100).toFixed(2)) + "%"; // A 중 B는 몇 %?
        break;
      case 3:
        const diff = parseFloat(((v2 - v1) / v1 * 100).toFixed(2)); // A → B 몇 % 변화?
        if (diff > 0) result = diff + "% 증가";
        else if (diff < 0) result = Math.abs(diff) + "% 감소";
        else result = "0% 변화 없음";
        break;
      case 4:
        result = parseFloat((v1 * (1 + v2 / 100)).toFixed(2)); // A에서 B% 증감하면?
        break;
      default:
        result = "";
    }

    setResults(prev => {
      const copy = [...prev];
      copy[index] = result;
      return copy;
    });
  };

  return (
    <div
      className="percent-calculator-container"
      style={{ left: position.x, top: position.y, position: 'absolute' }}
    >
      <div className="percent-calculator-header" onMouseDown={handleMouseDown}>
        <span>퍼센트 계산기</span>
        <X onClick={onClose} className="close-btn" />
      </div>

      <div className="percent-calculator-body">
        {/* A의 B%는? */}
        <div className="calc-block">
          {'금액 중 % 값 구하기'}
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="전체값 (ex:10000)" />
          <span className="inline-label">의</span>
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="%값 (ex:20)" />
          <span className="inline-label">%</span>
          <button onClick={() => handleCalculate(1, 0)}>계산</button>
          <div className="result">{results[0]}</div>
        </div>

        {/* A 중 B는 몇 %? */}
        <div className="calc-block">
          {'금액의 일부 % 구하기'}
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="전체값 (예: 10000)" />
          <span className="inline-label">의</span>
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="일부값 (예: 500)" />
          <span className="inline-label">은 몇%?</span>
          <button onClick={() => handleCalculate(2, 1)}>계산</button>
          <div className="result">{results[1]}</div>
        </div>

        {/* A → B는 몇 % 변화? */}
        <div className="calc-block">
          {'금액의 증감 값의 % 구하기'}
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="시작값 (예: 10000)" />
          <span className="inline-label">→</span>
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="변화값 (예: 25000)" />
          <span className="inline-label">몇%?</span>
          <button onClick={() => handleCalculate(3, 2)}>계산</button>
          <div className="result">{results[2]}</div>
        </div>

        {/* A에서 B% 증감하면? */}
        <div className="calc-block">
          {'금액에 % 증감 값 구하기'}
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="기본값 (예: 10000)" />
          <span className="inline-label">이/가</span>
          <input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="변화율 (예: 25)" />
          <span className="inline-label">%</span>
          <button onClick={() => handleCalculate(4, 3)}>계산</button>
          <div className="result">{results[3]}</div>
        </div>
      </div>
    </div>
  );
};

export default PercentCalculator;
