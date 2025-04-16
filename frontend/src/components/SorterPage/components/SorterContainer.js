import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import React, { useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { X } from 'lucide-react';
import { edtingSorterIdAtom } from '../atoms/atoms';
import { useAtom } from 'jotai';

const settings = {
    dots: true,
    infinite: true, // 무한 루프
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    centerMode: true,
    centerPadding: '40px' // 터치 이동을 비활성화하여 드래그 시 슬라이드 전환을 막습니다.
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

    const [editingSorterId, setEditingSorterId] = useAtom(edtingSorterIdAtom);
    const [activeId, setActiveId] = useState(null);
    const [draggingOverBox, setDraggingOverBox] = useState(false);  // 드래그가 `sorter-box`에 올려졌는지 여부 확인
    const activeSorter = sorters.find(sorter => sorter.sorter_id === activeId);

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        const oldIndex = sorters.findIndex((s) => s.sorter_id === active.id);
        const newIndex = sorters.findIndex((s) => s.sorter_id === over.id);

        // 드롭 위치가 `sorter-box`인지 확인
        if (draggingOverBox) {
            // `sorter-box`에 추가하는 로직
            // 예를 들어, 드래그한 sorter를 해당 위치에 추가하는 로직
            setSorters([...sorters, { ...active, sorter_id: new Date().getTime() }]);
        } else {
            setSorters(arrayMove(sorters, oldIndex, newIndex));
        }
    };

    // `sorter-box`에 드래그가 올라가면 상태 변경
    const handleDragOverBox = (isOver) => {
        setDraggingOverBox(isOver);
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
                                        className="sorter-title-section"
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

                                    <div
                                        className="sorter-box"
                                        onDragEnter={() => handleDragOverBox(true)} // 드래그가 `sorter-box`에 올라갔을 때
                                        onDragLeave={() => handleDragOverBox(false)} // 드래그가 `sorter-box`에서 벗어났을 때
                                    >
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
