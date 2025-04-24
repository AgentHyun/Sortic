import React, { useState, useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { message, Tooltip } from 'antd';
import { useDroppable } from '@dnd-kit/core';
import { X } from 'lucide-react';

import {
  edtingSorterIdAtom, selectedElementIdsAtom, elementsRefreshTriggerAtom, isEditingElementAtom, sorterCardsAtom,
  newElementNameAtom, editingElementIndexAtom, contextMenuAtom, selectedElementIdAtom,
  newElementPriceAtom, selectedElementIdsBySorterAtom, selectedElementNamesBySorterAtom, selectedSorterIdsAtom
} from '../atoms/atoms';

import {
  handleElementDoubleClickAtSorterAction, handleElementNameSaveAction, setSelectedElementAction,
  fetchElementPriceByIdAction
} from "../actions/elementAction";
import {
  getElementsIdBySorterIdAction, getElementNameByIdAction, updateSorterNameAction, getSorterIdByNameAndElementIdAction
} from "../actions/sorterAction"; // API 액션 수정
import SorterBox from "./SorterBox";
import axios from "axios";

// SorterContainer 수정
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
  const [, setGetElementsIdBySorterId] = useAtom(getElementsIdBySorterIdAction);
  const [, setGetElementNameById] = useAtom(getElementNameByIdAction);
  const [, setFetchElementPriceById] = useAtom(fetchElementPriceByIdAction);
  const [newElementName, setNewElementName] = useAtom(newElementNameAtom);


  const [handleElementDoubleClick, setHandleElementDoubleClick] = useAtom(handleElementDoubleClickAtSorterAction);


  const setContextMenu = useSetAtom(contextMenuAtom);
  const [, setSetSelectedElement] = useAtom(setSelectedElementAction);
  const [, setSelectedElementId] = useAtom(selectedElementIdAtom);
  const [, setSorterCards] = useAtom(sorterCardsAtom);
  const [, setHandleElementNameSave] = useAtom(handleElementNameSaveAction);
  const [, setSetSelectedElementId] = useAtom(setSelectedElementAction);
  const [, setUpdateSorterNameAction] = useAtom(updateSorterNameAction);
  const [selectedElementNamesBySorter, setSelectedElementNamesBySorter] = useAtom(selectedElementNamesBySorterAtom);
  const [selectedElementIdsBySorter, setSelectedElementIdsBySorter] = useAtom(selectedElementIdsBySorterAtom);
  const [selectedSorterIds, setSelectedSorterIds] = useAtom(selectedSorterIdsAtom);

  useEffect(() => {
    const selectedSorterIds = Object.keys(selectedElementIdsBySorter).filter(
      (key) => selectedElementIdsBySorter[key].length > 0
    );

    setSelectedSorterIds(selectedSorterIds);

  }, [selectedElementIdsBySorter]);

  useEffect(() => {
    const fetchAllElementNames = async () => {
      const result = {};
      for (const sorter of sorters) {
        try {
          // 수정된 부분: getElementsIdBySorterIdAction을 비동기 호출
          const ids = await setGetElementsIdBySorterId(sorter.sorter_id);
          const idList = Array.isArray(ids) ? ids : [];

          // getElementNameByIdAction을 사용하여 요소 이름을 비동기적으로 가져옴
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
      setSorterCards(result); // 상태 업데이트
    };

    fetchAllElementNames();
  }, [sorters, elementsRefreshTrigger, setGetElementsIdBySorterId, setGetElementNameById, setSorterCards]);

  const handleElementClick = async (elementId, sorterId, event) => {
    if (event?.stopPropagation) event.stopPropagation();

    try {
      const updatedIdsBySorter = { ...selectedElementIdsBySorter };
      const prevSelected = updatedIdsBySorter[sorterId] || [];
      const newSelected = prevSelected.includes(elementId)
        ? prevSelected.filter((id) => id !== elementId)
        : [...prevSelected, elementId];

      updatedIdsBySorter[sorterId] = newSelected;
      setSelectedElementIdsBySorter(updatedIdsBySorter);

      const updatedNamesBySorter = { ...selectedElementNamesBySorter };
      const index = elementNamesBySorter[sorterId]?.ids?.indexOf(elementId);
      const elementName = elementNamesBySorter[sorterId]?.names?.[index];
      const prevNames = updatedNamesBySorter[sorterId] || [];

      const newNames = prevNames.includes(elementName)
        ? prevNames.filter((name) => name !== elementName)
        : [...prevNames, elementName];

      updatedNamesBySorter[sorterId] = newNames;
      setSelectedElementNamesBySorter(updatedNamesBySorter);

      const allSelectedIds = Object.values(updatedIdsBySorter).flat();
      const collectedSorterIds = [];
      allSelectedIds.forEach((id) => {
        sorters.forEach((sorter) => {
          const sid = String(sorter.sorter_id);
          if (
            elementNamesBySorter[sid]?.ids?.includes(id) &&
            !collectedSorterIds.includes(sid)
          ) {
            collectedSorterIds.push(sid);
          }
        });
      });

      setSelectedSorterIds(collectedSorterIds);
    } catch (error) {
      console.error('🚨 sorter_id 조회 실패:', error);
      message.error("sorter_id 조회에 실패했습니다.");
    }
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
                onDoubleClick={() => handleSorterNameDoubleClick(sorter.sorter_id, sorter.sorter_name)} // 더블 클릭 시 이름 수정
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

                    const isSelected = selectedElementIdsBySorter[sorter.sorter_id]?.includes(elementId);

                    return name && elementId != null ? (
                      <div
                        key={elementId}
                        id={`element-${elementId}`}
                        className={`element-item ${isSelected ? 'selected-sorter-item' : ''}`}
                        onClick={(event) => handleElementClick(elementId, sorter.sorter_id, event)}
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
