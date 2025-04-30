import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableElement = ({ sorterId, id, name, isSelected, onClick, onContextMenu }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${sorterId}-${id}` }); // sorter_id와 element_id를 합쳐 고유한 id 부여

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    marginTop : '10px',
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      id={`element-${sorterId}-${id}`} // sorter_id와 element_id를 합쳐 고유한 id 부여
      className={`element-item ${isSelected ? 'selected-sorter-item' : ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {name}
    </div>
  );
};

export default SortableElement;
