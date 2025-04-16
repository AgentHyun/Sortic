import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({
                          card,
                          isSelected,
                          isEditing,
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
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.elements_name_id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transform ? 'transform 500ms ease-in-out' : undefined,// ✅ 부드러운 트랜지션
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.7 : 1, // ✅ 드래그 중 시각 피드백
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className={`category-item ${isSelected ? 'selected' : ''}`}
            onContextMenu={(e) => {
                e.preventDefault();
                openContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    target: card,
                    elementId: card.elements_name_id,
                });
                setNewElementName(card.elements_name);
                setNewElementPrice(card.elements_price);
                setSelectedElementId(card.elements_name_id);
                setSetSelectedElementAction(card.elements_name_id);
            }}
            onDoubleClick={() => handleDoubleClickElementName(card.elements_name_id)}
            onClick={() => setToggleSelectElementAction(card.elements_name_id)}
        >
            {isEditing ? (
                <input
                    value={newElementName}
                    onChange={handleElementNameChange}
                    onBlur={() => handleElementSaveName(card.elements_name_id)}
                    onKeyDown={(e) => e.key === "Enter" && handleElementSaveName(card.elements_name_id)}
                    autoFocus
                />
            ) : (
                card.elements_name
            )}
        </div>
    );
};

export default SortableItem;
