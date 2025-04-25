// src/components/SorterPage/components/SorterBox.js
import React, {useEffect} from 'react';
import { useDroppable } from '@dnd-kit/core';

const SorterBox = ({ sorterId, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: sorterId.toString() });

  return (
    <div
      ref={setNodeRef}
      className="sorter-box"
      style={{
        backgroundColor: isOver ? '#fff8e1' : '#ffffff',
        borderRadius: '12px',
        boxShadow: isOver
          ? '0 0 12px 3px rgba(90, 110, 200, 0.3)'
          : '0 2px 10px rgba(0, 0, 0, 0.05)',
        border: isOver ? '2px dashed #5a6ec8' : '1px solid #d9d9d9',
        padding: '20px',
        position: 'relative',
        transform: isOver ? 'scale(1.02)' : 'scale(1)',
        transition:
          'all 0.25s ease-in-out, transform 0.2s ease-in-out',
      }}
    >
      {children}
    </div>
  );
};


export default SorterBox;
