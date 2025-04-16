import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import React, { useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Trash,X } from 'lucide-react';
import { edtingSorterIdAtom } from '../atoms/atoms';
import { useAtom } from 'jotai'; // useAtom 임포트

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const SorterContainer = ({
                             sorters,
                             setSorters,
                             selectedSorters,
                             handleSorterClick,
                             deleteSorter,
                             multiDeleteSorters,
                             inputValue,
                             setInputValue,
                             handleSaveSorterName,
                             handleSorterNameDoubleClick
                         }) => {

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        })
    );

    // useAtom을 컴포넌트 내부로 이동
    const [editingSorterId, setEditingSorterId] = useAtom(edtingSorterIdAtom);

    const [activeId, setActiveId] = useState(null);
    const activeSorter = sorters.find(sorter => sorter.sorter_id === activeId);

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
        console.log("드래그 시작:", active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over || active.id === over.id) return;

        const oldIndex = sorters.findIndex((s) => s.sorter_id === active.id);
        const newIndex = sorters.findIndex((s) => s.sorter_id === over.id);
        setSorters(arrayMove(sorters, oldIndex, newIndex));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={sorters.map((s) => s.sorter_id)}
                strategy={rectSortingStrategy}
            >
                <div className="sorter-scroll-wrapper">
                    <Slider {...settings}>
                        {sorters.map((sorter) => (
                            <div key={sorter.sorter_id}>
                                <div
                                    onClick={() => handleSorterClick(sorter.sorter_id)}
                                    className={`sorter-wrapper ${selectedSorters.includes(sorter.sorter_id) ? 'selected-sorter' : ''}`}
                                >
                                    <div
                                        className="sorter-title -section"
                                        onDoubleClick={() => handleSorterNameDoubleClick(sorter.sorter_id, sorter.sorter_name)}
                                    >
                                        {editingSorterId === sorter.sorter_id ? (
                                            <input
                                                autoFocus
                                                value={inputValue ?? ''}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onBlur={() => {
                                                    if (inputValue !== sorter.sorter_name) {
                                                        handleSaveSorterName(sorter.sorter_id);
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleSaveSorterName(sorter.sorter_id);
                                                    } else if (e.key === 'Escape') {
                                                        setEditingSorterId(null);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            sorter.sorter_name
                                        )}
                                    </div>

                                    <div className="sorter-box">
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteSorter(sorter.sorter_id)}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>

                    {selectedSorters.length > 0 && (
                        <button className="delete-selected-btn" onClick={multiDeleteSorters}>
                            전체 삭제
                        </button>
                    )}
                </div>
            </SortableContext>

            <DragOverlay>
                {activeSorter ? (
                    <div className="sorter-item dragging">
                        {activeSorter.sorter_name}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default SorterContainer;
