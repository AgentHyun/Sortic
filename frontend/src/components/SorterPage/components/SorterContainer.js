import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useAtom, useSetAtom} from 'jotai';
import { Tooltip} from 'antd';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { X } from 'lucide-react';

import { edtingSorterIdAtom, selectedElementIdsAtom, elementsRefreshTriggerAtom, isEditingElementAtom, sorterCardsAtom, newElementNameAtom, editingElementIdAtom,
  editingElementIndexAtom, contextMenuAtom, selectedElementIdAtom, newElementPriceAtom , elementDetailDataAtom


} from '../atoms/atoms';

import { handleElementDoubleClickAtSorterAction, handleElementNameSaveAction, setSelectedElementAction, fetchElementPriceByIdAction } from "../actions/elementAction";
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
    const [, setFetchElementPriceById] = useAtom(fetchElementPriceByIdAction);
  const [data, setData] = useAtom(elementDetailDataAtom);
  const [contextMenuInfo, setContextMenuInfo] = useState(null);
    const [newElementName, setNewElementName] = useAtom(newElementNameAtom);
    const [newElementPrice, setNewElementPrice] = useAtom(newElementPriceAtom);
    const [clickTimeout, setClickTimeout] = useState(null); // 클릭 타이머 상태
    const [handleElementDoubleClick, setHandleElementDoubleClick] = useAtom(handleElementDoubleClickAtSorterAction);
    const [isEditingElement, setIsEditingElement] = useAtom(isEditingElementAtom);
    const [editingElementIndex, setEditingElementIndex] = useAtom(editingElementIndexAtom);
    const activeSorter = sorters.find(sorter => sorter.sorter_id === activeId);
    const inputRef = useRef(null); // input 요소를 위한 ref
  const setContextMenu = useSetAtom(contextMenuAtom);
const [,setSetSelectedElement] = useAtom(setSelectedElementAction);
const [, setSelectedElementId] = useAtom(selectedElementIdAtom);
    const handleElementNameChange = (e) => {
        setNewElementName(e.target.value);
    };



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


  const handleContextMenu = async (event, elementId, name) => {
    event.preventDefault();

    // 새로운 이름을 상태로 설정
    setNewElementName(name);

    // 가격을 비동기적으로 가져옵니다.
    const fetchedPrice = await setFetchElementPriceById(elementId);

    // 이름과 가격 설정
    console.log("새이름", name); // name은 바로 사용 가능
    console.log("새가격", fetchedPrice); // 이제 fetchedPrice가 제대로 출력됩니다.

    // 가격을 가져온 후에 setData와 setContextMenu를 호출하여 상태를 업데이트합니다.
    setData({ elements_name: name, elements_price: fetchedPrice, elements_name_id: elementId });

    // 기존 코드에서 `target`에 `price`를 추가
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      visible: true,
      elementId,
      target: { name, price: fetchedPrice },  // name과 price를 모두 포함
    });


    // 선택 상태 업데이트
    setSelectedElementIds([elementId]);
    setHandleElementDoubleClick(elementId);
    setSelectedElementId(elementId);
    setSetSelectedElement(elementId);
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
                                                    onContextMenu={(e) => handleContextMenu(e, elementId, name)}
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
