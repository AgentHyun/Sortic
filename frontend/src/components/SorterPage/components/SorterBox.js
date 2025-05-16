// src/components/SorterPage/components/SorterBox.js
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const SorterBox = ({ sorterId, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "sorter-" + sorterId.toString() });

  return (
    <div
      ref={setNodeRef}
      className="sorter-box"
      style={{
        backgroundColor: isOver ? '#fff8e1' : '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        position: 'relative',
        transform: isOver ? 'scale(1.02)' : 'scale(1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      {children}
    </div>
  );
};

export default SorterBox;
