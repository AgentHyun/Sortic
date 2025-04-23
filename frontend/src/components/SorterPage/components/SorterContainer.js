import React, { useState, useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import {message, Tooltip} from 'antd';
import { useDroppable } from '@dnd-kit/core';
import { X } from 'lucide-react';

import {
  edtingSorterIdAtom, selectedElementIdsAtom, elementsRefreshTriggerAtom, isEditingElementAtom, sorterCardsAtom,
  newElementNameAtom,  editingElementIndexAtom, contextMenuAtom, selectedElementIdAtom,
  newElementPriceAtom, selectedElementIdsBySorterAtom, selectedElementNamesBySorterAtom
} from '../atoms/atoms';

import {
  handleElementDoubleClickAtSorterAction, handleElementNameSaveAction, setSelectedElementAction,
  fetchElementPriceByIdAction
} from "../actions/elementAction";
import {
  getElementsIdBySorterNameAction, getElementNameByIdAction, updateSorterNameAction
} from "../actions/sorterAction";  // updateSorterNameAction 추가
import SorterBox from "./SorterBox";
import axios from "axios";

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
  const [editingSorterId, setEditingSorterId] = useAtom(edtingSorterIdAtom);
  const [elementNamesBySorter, setElementNamesBySorter] = useState({});
  const [selectedElementIds, setSelectedElementIds] = useAtom(selectedElementIdsAtom);
  const [elementsRefreshTrigger] = useAtom(elementsRefreshTriggerAtom);
  const [, setGetElementsIdBySorterName] = useAtom(getElementsIdBySorterNameAction);
  const [, setGetElementNameById] = useAtom(getElementNameByIdAction);
  const [, setFetchElementPriceById] = useAtom(fetchElementPriceByIdAction);
  const [newElementName, setNewElementName] = useAtom(newElementNameAtom);
  const [newElementPrice, setNewElementPrice] = useAtom(newElementPriceAtom);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [handleElementDoubleClick, setHandleElementDoubleClick] = useAtom(handleElementDoubleClickAtSorterAction);
  const [isEditingElement, setIsEditingElement] = useAtom(isEditingElementAtom);
  const [editingElementIndex, setEditingElementIndex] = useAtom(editingElementIndexAtom);
  const setContextMenu = useSetAtom(contextMenuAtom);
  const [, setSetSelectedElement] = useAtom(setSelectedElementAction);
  const [, setSelectedElementId] = useAtom(selectedElementIdAtom);
  const [, setSorterCards] = useAtom(sorterCardsAtom);
  const [, setHandleElementNameSave] = useAtom(handleElementNameSaveAction);
  const [, setSetSelectedElementId] = useAtom(setSelectedElementAction);
 const [, setUpdateSorterNameAction] = useAtom(updateSorterNameAction);
 const [selectedElementNamesBySorter,   setSelectedElementNamesBySorter] = useAtom(selectedElementNamesBySorterAtom);
  const [selectedElementIdsBySorter, setSelectedElementIdsBySorter] = useAtom(selectedElementIdsBySorterAtom);
  useEffect(() => {
    console.log("최종 선택된 요소 상태: ", selectedElementIdsBySorter);
  }, [selectedElementIdsBySorter]);
  useEffect(() => {
    const fetchAllElementNames = async () => {
      const result = {};
      for (const sorter of sorters) {
        try {
          const ids = await setGetElementsIdBySorterName(sorter.sorter_name);
          const idList = Array.isArray(ids) ? ids : [];
          const names = await Promise.all(
            idList.map(async (id) => {
              const name = await setGetElementNameById(id);
              return name;
            })
          );
          result[sorter.sorter_id] = { ids: idList, names };
        } catch (err) {
          result[sorter.sorter_id] = { ids: [], names: [] };
        }
      }
      setElementNamesBySorter(result);
      setSorterCards(result);
    };

    fetchAllElementNames();
  }, [sorters, elementsRefreshTrigger]);

  const clickTimeoutRef = useRef(null);

  const handleElementClick = (elementId, sorterName, event) => {
    if (event?.stopPropagation) event.stopPropagation();

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      // 1️⃣ sorterName에 해당하는 모든 sorter_id 수집
      const matchingSorterIds = Object.keys(elementNamesBySorter).filter(
        sid => sorters.find(s => String(s.sorter_id) === sid)?.sorter_name === sorterName
      );

      // 2️⃣ 해당 sorter_id들에 해당하는 모든 요소 ID 및 이름 수집
      const allElementIds = matchingSorterIds.flatMap(
        sid => elementNamesBySorter[sid]?.ids || []
      );
      const allElementNames = matchingSorterIds.flatMap(
        sid => elementNamesBySorter[sid]?.names || []  // names 구조가 있어야 함
      );

      console.log(`🔎 [${sorterName}]와 관련된 sorter_id들:`, matchingSorterIds);
      console.log(`✅ 포함된 요소 ID들:`, allElementIds);
      console.log(`✅ 포함된 요소 이름들:`, allElementNames);

      // 3️⃣ ID 선택 상태 업데이트
      setSelectedElementIdsBySorter((prev) => {
        const prevSelected = prev[sorterName] || [];
        const filtered = prevSelected.filter((id) => allElementIds.includes(id));

        let newSelected;
        if (filtered.includes(elementId)) {
          newSelected = filtered.filter((id) => id !== elementId);
        } else {
          newSelected = [...filtered, elementId];
        }

        console.log(`🟢 선택된 ID들 [${sorterName}]:`, newSelected);

        return {
          ...prev,
          [sorterName]: newSelected,
        };
      });

      // 4️⃣ 이름 선택 상태 업데이트
      setSelectedElementNamesBySorter((prev) => {
        const index = allElementIds.indexOf(elementId);
        const elementName = allElementNames[index];
        const prevNames = prev[sorterName] || [];

        let newNames;
        if (prevNames.includes(elementName)) {
          newNames = prevNames.filter(name => name !== elementName);
        } else {
          newNames = [...prevNames, elementName];
        }

        console.log(`🟣 선택된 이름들 [${sorterName}]:`, newNames);

        return {
          ...prev,
          [sorterName]: newNames,
        };
      });
    }, 200);
  };




  const handleElementsDoubleClick = (elementId, sorterName) => {
    setHandleElementDoubleClick(elementId);
    setEditingElementIndex(elementId);
  };

  const handleContextMenu = async (event, elementId, name) => {
    event.preventDefault();
    setNewElementName(name);
    const fetchedPrice = await setFetchElementPriceById(elementId);
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      visible: true,
      elementId,
      target: { name, price: fetchedPrice },
    });
    setSelectedElementIds([elementId]);
    setHandleElementDoubleClick(elementId);
    setSelectedElementId(elementId);
    setSetSelectedElement(elementId);
  };



  const { setNodeRef } = useDroppable({
    id: 'sorters-container',
  });

  return (
    <div ref={setNodeRef} className="sorter-scroll-wrapper">
      <div className="sorter-list">
        {sorters.map((sorter) => (
          <div key={sorter.sorter_id} className="sorter-wrapper">
            <div
              onClick={() => handleSorterClick(sorter.sorter_id)}
              className={`sorter-card ${selectedSorters.includes(sorter.sorter_id) ? 'selected-sorter' : ''}`}
            >
              <div
                className="sorter-title"
                onDoubleClick={() => handleSorterNameDoubleClick(sorter.sorter_id,sorter.sorter_name)} // 더블 클릭 시 이름 수정
              >
                {editingSorterId === sorter.sorter_id ? (
                  <input
                    value={inputValue ?? ''}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={() => handleSaveSorterName(sorter.sorter_name)} // 수정 후 blur 시 저장
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveSorterName(sorter.sorter_name);
                      else if (e.key === 'Escape') setEditingSorterId(null);
                    }}
                  />
                ) : (
                  sorter.sorter_name
                )}
              </div>
              <button className="delete-btn" onClick={() => deleteSorter(sorter.sorter_id)}>
                <X size={18} />
              </button>
              <SorterBox sorterId={sorter.sorter_id}>
                <div className="element-names">
                  {elementNamesBySorter[sorter.sorter_id]?.names?.map((name, idx) => {
                    const elementId = elementNamesBySorter[sorter.sorter_id]?.ids?.[idx];
                    return name && elementId != null ? (
                      <div
                        key={elementId}
                        id={`element-${elementId}`}
                        className={`element-item ${
                          selectedElementIdsBySorter[sorter.sorter_name]?.includes(elementId)
                            ? 'selected-sorter-item'
                            : ''
                        }`}

                        onClick={(event) => handleElementClick(elementId, sorter.sorter_name, event)}

                        onDoubleClick={() => handleElementsDoubleClick(elementId)}
                        onContextMenu={(e) => handleContextMenu(e, elementId, name)}
                      >
                        {name}
                      </div>
                    ) : null;
                  })}
                </div>
              </SorterBox>

            </div>
          </div>
        ))}
      </div>
      {selectedSorters.length > 0 && (
        <button className="delete-selected-btn" onClick={multiDeleteSorters}>
          Delete
        </button>
      )}
    </div>
  );
};

export default SorterContainer;
