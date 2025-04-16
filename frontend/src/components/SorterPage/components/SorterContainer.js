import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { X } from 'lucide-react';
import { edtingSorterIdAtom } from '../atoms/atoms';
import { useAtom } from 'jotai';
import { getElementsIdBySorterNameAction, getElementNameByIdAction } from "../actions/sorterAction"; // 액션 확인 필요

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    centerMode: true,
    centerPadding: '40px'
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
            activationConstraint: { distance: 1 }
        })
    );

    const [editingSorterId, setEditingSorterId] = useAtom(edtingSorterIdAtom);
    const [activeId, setActiveId] = useState(null);
    const [draggingOverBox, setDraggingOverBox] = useState(false);
    const [elementNamesBySorter, setElementNamesBySorter] = useState({});

    // 액션 함수를 set으로 사용하여 atom을 업데이트하도록 수정
    const [, setGetElementsIdBySorterName] = useAtom(getElementsIdBySorterNameAction);
    const [, setGetElementNameById] = useAtom(getElementNameByIdAction);

    const activeSorter = sorters.find(sorter => sorter.sorter_id === activeId);

    useEffect(() => {
        const fetchAllElementNames = async () => {
            console.log("📦 [useEffect] sorters 변경 감지됨. 현재 sorters:", sorters);

            const result = {};
            for (const sorter of sorters) {
                try {
                    console.log(`🔍 Fetching sorter_name for sorter_id: ${sorter.sorter_id}`);

                    // sorter_name으로 element_ids 조회
                    const ids = await setGetElementsIdBySorterName(sorter.sorter_name);
                    console.log(`✅ Elements IDs for sorter_name ${sorter.sorter_name}:`, ids);

                    const idList = Array.isArray(ids) ? ids : [];
                    console.log(`🔍 idList:`, idList);

                    // element names를 id로부터 가져오기
                    const names = await Promise.all(
                        idList.map(async (id) => {
                            console.log(`🔎 Fetching name for element with id: ${id}`);
                            const name = await setGetElementNameById(id);
                            console.log(`🧩 Element name for id ${id}:`, name);
                            return name;
                        })
                    );

                    result[sorter.sorter_id] = names;
                    console.log(`🎯 Finished fetching names for sorter ${sorter.sorter_id}:`, names);

                } catch (err) {
                    console.error(`❌ Error fetching for sorter ${sorter.sorter_id}:`, err);
                    result[sorter.sorter_id] = [];
                }
            }

            // 상태 업데이트
            setElementNamesBySorter(result);
            console.log("🧾 전체 element 이름 매핑 완료:", result);
        };

        fetchAllElementNames();
    }, [sorters, setGetElementsIdBySorterName, setGetElementNameById]);

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

        if (draggingOverBox) {
            // 드래그된 아이템이 새로운 정렬자 상자에 추가되는 경우
            const existingSorter = sorters.find((sorter) => sorter.sorter_name === active.sorter_name);

            if (existingSorter) {
                // 기존 sorter에 요소 추가
                setSorters((prevSorters) =>
                    prevSorters.map((sorter) =>
                        sorter.sorter_id === existingSorter.sorter_id
                            ? { ...sorter, elements: [...sorter.elements, { element_id: new Date().getTime() }] }
                            : sorter
                    )
                );
            } else {
                // 새로운 sorter 추가
                setSorters([...sorters, { ...active, sorter_id: new Date().getTime(), elements: [{ element_id: new Date().getTime() }] }]);
            }
        } else {
            // 기존 정렬자 순서 변경
            setSorters(arrayMove(sorters, oldIndex, newIndex));
        }
    };


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
                                        onDragEnter={() => handleDragOverBox(true)}
                                        onDragLeave={() => handleDragOverBox(false)}
                                    >
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteSorter(sorter.sorter_id)}
                                        >
                                            <X size={18} />
                                        </button>

                                        <div className="element-names">
                                            {elementNamesBySorter[sorter.sorter_id]?.map((name, idx) => (
                                                <div key={idx} className="element-item">
                                                    {name}
                                                </div>
                                            ))}
                                        </div>
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
