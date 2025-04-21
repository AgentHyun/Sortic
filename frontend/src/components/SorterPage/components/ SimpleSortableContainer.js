import React from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import SortableItem from "./SortableItem";

// SortableItem 컴포넌트 정의
const SimpleSortableContainer = ({
                                   cards,
                                   selectedElementIds,
                                   isEditingElement,
                                   editingElementIndex,
                                   newElementName,
                                   handleElementNameChange,
                                   handleElementSaveName,
                                   handleDoubleClickElementName,
                                   openContextMenu,
                                   setNewElementName,
                                   setNewElementPrice,
                                   setSelectedElementId,
                                   setSetSelectedElementAction,
                                   setToggleSelectElementAction,
                                 }) => {
  // 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 드래그 시작을 감지하기 위한 최소 거리
      },
    })
  );

  // 드래그 시작 핸들러
  const handleDragStart = (event) => {
    console.log('Drag started', event);
    // 드래그가 시작될 때 필요한 로직 추가
  };

  // 드래그 종료 핸들러
  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over) {
      console.log('Dragged item:', active.id);
      console.log('Dropped over:', over.id);
      // 드래그 종료 후의 상태 업데이트 또는 위치 변경
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="box-section-wrapper" style={{ maxHeight: 'calc(28vh - 80px)', overflowY: 'auto', flexGrow: 1, marginLeft: '1vw' }}>
        <div className="box-section">
          <SortableContext items={cards.map((c) => c.elements_name_id)} strategy={rectSortingStrategy}>
            {cards.map((card) => {
              const isSelected = selectedElementIds.includes(card.elements_name_id);
              const isEditing = isEditingElement && editingElementIndex === card.elements_name_id;

              return (
                <SortableItem
                  key={card.elements_name_id}
                  card={card}
                  isSelected={isSelected}
                  isEditing={isEditing}
                  newElementName={newElementName}
                  handleElementNameChange={handleElementNameChange}
                  handleElementSaveName={handleElementSaveName}
                  handleDoubleClickElementName={handleDoubleClickElementName}
                  setToggleSelectElementAction={setToggleSelectElementAction}
                />
              );
            })}
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
};

export default SimpleSortableContainer;
