// components/SortableElement.js
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableElement = ({ id, name, isSelected, onClick, onContextMenu }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      id={`element-${id}`}
      className={`element-item ${isSelected ? 'selected-sorter-item' : ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {name}
    </div>
  );
};

export default SortableElement;
