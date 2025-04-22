import React, { useState, useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { Tooltip } from 'antd';
import { useDroppable } from '@dnd-kit/core';
import { X } from 'lucide-react';

import {
  edtingSorterIdAtom, selectedElementIdsAtom, elementsRefreshTriggerAtom, isEditingElementAtom, sorterCardsAtom,
  newElementNameAtom, editingElementIdAtom, editingElementIndexAtom, contextMenuAtom, selectedElementIdAtom,
  newElementPriceAtom, elementDetailDataAtom,
} from '../atoms/atoms';

import {
  handleElementDoubleClickAtSorterAction, handleElementNameSaveAction, setSelectedElementAction,
  fetchElementPriceByIdAction
} from "../actions/elementAction";
import {
  getElementsIdBySorterNameAction, getElementNameByIdAction, updateSorterNameAction
} from "../actions/sorterAction";  // updateSorterNameAction 추가
import SorterBox from "./SorterBox";

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

  const handleElementClick = (elementId, sorterId, event) => {
    if (event?.stopPropagation) event.stopPropagation();

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      setSelectedElementIds((prev) => {
        if (prev.includes(elementId)) {
          return prev.filter((id) => id !== elementId);
        } else {
          // 중복 확인 후 추가
          return prev.includes(elementId) ? prev : [...prev, elementId];
        }
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
                        className={`element-item ${selectedElementIds?.includes(elementId) ? 'selected' : ''}`}
                        onClick={(event) => handleElementClick(elementId, sorter.sorter_id, event)}
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
