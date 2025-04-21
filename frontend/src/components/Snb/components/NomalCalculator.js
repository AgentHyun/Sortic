import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../css/calculator.css';

const NormalCalculator = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 200, y: 200 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
      document.body.style.userSelect = 'none'; // 드래그 중 텍스트 선택 방지
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.userSelect = 'auto'; // 드래그 끝나면 다시 가능하게
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

  return (
    <div
      className="calculator-container"
      style={{ left: position.x, top: position.y, position: 'absolute' }}
    >
      <div className="calculator-header" onMouseDown={handleMouseDown}>
        <span>일반 계산기</span>
        <X onClick={onClose} className="close-btn" />
      </div>
      <div className="calculator-body">
        {'나중에 추가'}
      </div>
    </div>
  );
};

export default NormalCalculator;
