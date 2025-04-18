import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { X } from 'lucide-react';
import { edtingSorterIdAtom, selectedElementIdsAtom, elementsRefreshTriggerAtom, isEditingElementAtom, sorterCardsAtom, newElementNameAtom, editingElementIdAtom, editingElementIndexAtom } from '../atoms/atoms';
import { useAtom } from 'jotai';
import { handleElementDoubleClickAtSorterAction, handleElementNameSaveAction, handleElement } from "../actions/elementAction";
import { getElementsIdBySorterNameAction, getElementNameByIdAction } from "../actions/sorterAction";

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    centerMode: true,
    centerPadding: '40px',


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
                             handleSorterNameDoubleClick,
                         }) => {
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 1 } }));

    const [editingSorterId, setEditingSorterId] = useAtom(edtingSorterIdAtom);
    const [activeId, setActiveId] = useState(null);
    const [draggingOverBox, setDraggingOverBox] = useState(false);
    const [elementNamesBySorter, setElementNamesBySorter] = useState({});
    const [selectedElementIds, setSelectedElementIds] = useAtom(selectedElementIdsAtom);
    const [elementsRefreshTrigger, setElementsRefreshTrigger] = useAtom(elementsRefreshTriggerAtom);
    const [, setGetElementsIdBySorterName] = useAtom(getElementsIdBySorterNameAction);
    const [, setGetElementNameById] = useAtom(getElementNameByIdAction);
    const [, setHandleElementNameSave] = useAtom(handleElementNameSaveAction);

    const [newElementName, setNewElementName] = useAtom(newElementNameAtom);
    const [clickTimeout, setClickTimeout] = useState(null); // 클릭 타이머 상태
    const [handleElementDoubleClick, setHandleElementDoubleClick] = useAtom(handleElementDoubleClickAtSorterAction);
    const [isEditingElement, setIsEditingElement] = useAtom(isEditingElementAtom);
    const [editingElementIndex, setEditingElementIndex] = useAtom(editingElementIndexAtom);
    const activeSorter = sorters.find(sorter => sorter.sorter_id === activeId);
    const inputRef = useRef(null); // input 요소를 위한 ref

    const handleElementNameChange = (e) => {
        setNewElementName(e.target.value);
    };

    useEffect(() => {
        // 편집 모드일 때, input에 포커스를 설정
        if (isEditingElement && inputRef.current) {
            inputRef.current.focus();  // 수동으로 포커스를 설정
        }
    }, [isEditingElement]); // isEditingElement가 변경될 때마다 실행

    useEffect(() => {
        const fetchAllElementNames = async () => {
            const result = {};

            for (const sorter of sorters) {
                try {
                    // sorter 이름에 해당하는 element_id를 가져오기
                    const ids = await setGetElementsIdBySorterName(sorter.sorter_name);
                    console.log(`📦 sorter ${sorter.sorter_name}에 대한 element ids:`, ids);

                    const idList = Array.isArray(ids) ? ids : [];
                    // 각 element_id에 대해 element 이름을 가져오기
                    const names = await Promise.all(
                        idList.map(async (id) => {
                            const name = await setGetElementNameById(id);
                            console.log(`🔍 element id ${id}에 대한 이름:`, name);
                            return name;
                        })
                    );

                    result[sorter.sorter_id] = { ids: idList, names: names };
                    console.log(`🎯 sorter ${sorter.sorter_id}에 대한 element names:`, names);

                } catch (err) {
                    console.error(`❌ sorter ${sorter.sorter_id}에 대한 fetch 에러:`, err);
                    result[sorter.sorter_id] = { ids: [], names: [] };
                }
            }

            // 상태 업데이트
            setElementNamesBySorter(result);
            console.log("🧾 element 이름 매핑 완료:", result);

            // sorterCardsAtom에 sorters 값 저장
            setSorterCards(result); // 이 줄을 추가하여 sorterCardsAtom에 데이터 저장
        };

        fetchAllElementNames();
    }, [sorters, elementsRefreshTrigger]);

    // sorterCardsAtom에 데이터 설정
    const [, setSorterCards] = useAtom(sorterCardsAtom);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        const oldIndex = sorters.findIndex((s) => s.sorter_id === active.id);
        const newIndex = sorters.findIndex((s) => s.sorter_id === over.id);

        if (draggingOverBox) {
            const existingSorter = sorters.find((sorter) => sorter.sorter_name === active.sorter_name);
            if (existingSorter) {
                setSorters((prevSorters) =>
                    prevSorters.map((sorter) =>
                        sorter.sorter_id === existingSorter.sorter_id
                            ? { ...sorter, elements: [...sorter.elements, { element_id: new Date().getTime() }] }
                            : sorter
                    )
                );
            } else {
                setSorters([...sorters, { ...active, sorter_id: new Date().getTime(), elements: [{ element_id: new Date().getTime() }] }]);
            }
        } else {
            setSorters(arrayMove(sorters, oldIndex, newIndex));
        }
    };

    const handleElementSaveName = async (elementId) => {
        try {
            await setHandleElementNameSave(elementId);

            // 저장 후 로컬 상태도 직접 업데이트
            setElementNamesBySorter((prev) => {
                const updated = { ...prev };
                for (const sorterId in updated) {
                    const index = updated[sorterId].ids.indexOf(elementId);
                    if (index !== -1) {
                        updated[sorterId].names[index] = newElementName; // 입력된 이름으로 바로 반영
                    }
                }
                return updated;
            });

            setIsEditingElement(false);
        } catch (error) {
            console.log("요소 수정 실패");
        }
    };

    const handleElementClick = (elementId, event) => {
        event.stopPropagation();

        // 더블 클릭 이벤트와 구분하기 위한 flag 설정
        if (clickTimeout) {
            clearTimeout(clickTimeout); // 이전 타이머 제거
        }

        setClickTimeout(setTimeout(() => {
            setSelectedElementIds((prev) => {
                if (Array.isArray(prev)) {
                    return prev.includes(elementId)
                        ? prev.filter((id) => id !== elementId) // 이미 선택된 상태라면 해제
                        : [...prev, elementId]; // 선택 추가
                }
                return [elementId]; // 첫 선택
            });
        }, 200)); // 200ms 후에 선택 상태 업데이트
    };

    const handleElementsDoubleClick = (elementId) => {
        setHandleElementDoubleClick(elementId);
        setEditingElementIndex(elementId);
    };

    const handleBlur = () => {
        if (newElementName !== '') {
            handleElementSaveName(editingElementIndex); // 수정된 값을 저장
        } else {
            setIsEditingElement(false); // 값이 없으면 편집 모드 종료
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={sorters.map((s) => s.sorter_id)} strategy={rectSortingStrategy}>
                <div className="sorter-scroll-wrapper">
                    <Slider {...settings}>
                        {sorters.map((sorter) => (
                            <div key={sorter.sorter_id}>
                                <div
                                    onClick={() => handleSorterClick(sorter.sorter_id)}
                                    className={`sorter-wrapper ${selectedSorters.includes(sorter.sorter_id) ? 'selected-sorter' : ''}`}
                                >
                                    <div
                                        className="sorter-title"
                                        onDoubleClick={() => handleSorterNameDoubleClick(sorter.sorter_id, sorter.sorter_name)}
                                    >
                                        {editingSorterId === sorter.sorter_id ? (
                                            <input
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
                                    <button className="delete-btn" onClick={() => deleteSorter(sorter.sorter_id)}>
                                        <X size={18} />
                                    </button>
                                    <div
                                        className="sorter-box"
                                    >

                                        <div className="element-names">
                                            {elementNamesBySorter[sorter.sorter_id]?.names?.map((name, idx) => {
                                                const elementId = elementNamesBySorter[sorter.sorter_id]?.ids?.[idx];
                                                return name !== null && elementId != null ? (
                                                    <div
                                                        key={elementId}
                                                        className={`element-item ${selectedElementIds?.includes(elementId) ? 'selected' : ''}`}
                                                        onClick={(event) => handleElementClick(elementId, event)}
                                                        onDoubleClick={() => handleElementsDoubleClick(elementId)}
                                                    >
                                                        {name}
                                                    </div>

                                                ) : null;
                                            })}
                                        </div>

                                    </div> </div> </div> ))} </Slider>    {selectedSorters.length > 0 && (
                    <button className="delete-selected-btn" onClick={multiDeleteSorters}>
                        Delete
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