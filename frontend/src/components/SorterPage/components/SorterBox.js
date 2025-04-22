// src/components/SorterPage/components/SorterBox.js
import React, {useEffect} from 'react';
import { useDroppable } from '@dnd-kit/core';

const SorterBox = ({ sorterId, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: sorterId.toString() });

  return (
    <div
      ref={setNodeRef}
      className="sorter-box"
      style={{         backgroundColor: isOver ? '#fffcf0' : '#ffffff',  // 드래그 오버 시 밝은 파란색 배경, 기본 상태는 흰색
        borderRadius: '8px',  // 부드러운 모서리
        boxShadow: isOver
          ? '0 4px 16px rgba(58, 78, 113, 0.2)'  // 드래그 오버 시 더 강한 그림자
          : '0 4px 12px rgba(0, 0, 0, 0.1)',  // 기본 상태에서 부드러운 그림자
        border: '1px solid #3a4e71',  // `#3a4e71` 색상으로 테두리 강조
        padding: '16px',  // 충분한 여백
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease, border 0.3s ease', }}
    >
      {children}
    </div>
  );
};


export default SorterBox;
