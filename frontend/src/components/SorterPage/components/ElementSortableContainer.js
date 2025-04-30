import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import React, { useState, useEffect, useRef } from 'react';
const SortableContainer = ({ cards, setCards, ...itemProps }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        })
    );

    const [activeId, setActiveId] = useState(null);
    const activeCard = cards.find(card => card.elements_name_id === activeId);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over || active.id === over.id) return;

        const oldIndex = cards.findIndex((c) => c.elements_name_id === active.id);
        const newIndex = cards.findIndex((c) => c.elements_name_id === over.id);
        setCards(arrayMove(cards, oldIndex, newIndex));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={cards.map((c) => c.elements_name_id)}
                strategy={rectSortingStrategy}
            >
                <div className="box-section-wrapper" style={{
                    maxHeight: 'calc(28vh - 80px)',
                    overflowY: 'auto',
                    flexGrow: 1,
                    marginLeft: '1vw',
                }}>
                    <div className="box-section">
                        {cards.map((card) => (
                            <SortableItem
                                key={card.elements_name_id}
                                card={card}
                                {...itemProps}
                                isSelected={itemProps.selectedElementIds.includes(card.elements_name_id)}
                                isEditing={itemProps.isEditingElement && itemProps.editingElementIndex === card.elements_name_id}
                            />
                        ))}
                    </div>
                </div>
            </SortableContext>

            {/* 👇 이게 핵심 */}
            <DragOverlay>
                {activeCard ? (
                    <div className="category-item dragging">
                        {activeCard.elements_name}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default SortableContainer;
