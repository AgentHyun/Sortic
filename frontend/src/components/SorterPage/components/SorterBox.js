// src/components/SorterPage/components/SorterBox.js
import React, {useEffect} from 'react';
import { useDroppable } from '@dnd-kit/core';

const SorterBox = ({ sorterId, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: sorterId.toString() });

  return (
    <div
      ref={setNodeRef}
      className="sorter-box"
      style={{ backgroundColor: isOver ? '#f0f8ff' : undefined }}
    >
      {children}
    </div>
  );
};


export default SorterBox;
