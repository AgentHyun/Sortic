import React, { useState, useEffect, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { message, Tooltip } from 'antd';
import { DragOverlay, useDroppable } from '@dnd-kit/core';
import { X } from 'lucide-react';

import {
  edtingSorterIdAtom, selectedElementIdsAtom, elementsRefreshTriggerAtom, isEditingElementAtom, sorterCardsAtom,
  newElementNameAtom, editingElementIndexAtom, contextMenuAtom, selectedElementIdAtom,
  newElementPriceAtom, selectedElementIdsBySorterAtom, selectedElementNamesBySorterAtom, selectedSorterIdsAtom,
  elementNamesBySorterAtom,
} from '../atoms/atoms';

import {
  handleElementDoubleClickAtSorterAction, handleElementNameSaveAction, setSelectedElementAction,
  fetchElementPriceByIdAction
} from "../actions/elementAction";
import {
  getElementsIdBySorterIdAction, getElementNameByIdAction, updateSorterNameAction, getSorterIdByNameAndElementIdAction
} from "../actions/sorterAction";

import SorterBox from "./SorterBox";
import axios from "axios";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableElement from "./SortableElement";
import SortableSorter from "./SortableSorter";

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
  const [elementNamesBySorter, setElementNamesBySorter] = useAtom(elementNamesBySorterAtom);
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
  const [activeElement, setActiveElement] = useState(null);
  const isFirstRender = useRef(true);
  const [isEditingElement,setIsEditingElement] = useAtom(isEditingElementAtom);

  useEffect(() => {
    const selectedSorterIds = Object.keys(selectedElementIdsBySorter).filter(
      (key) => selectedElementIdsBySorter[key].length > 0
    );
    setSelectedSorterIds(selectedSorterIds);
  }, [selectedElementIdsBySorter]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // 첫 렌더링에는 useEffect가 동작하지 않도록 방지
    }

    const fetchAllElementNames = async () => {
      const result = {};
      for (const sorter of sorters) {
        try {
          const ids = await setGetElementsIdBySorterId(sorter.sorter_id);
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
      setElementNamesBySorter(result); // 상태 업데이트
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

    setHandleElementDoubleClick(elementId);
    setIsEditingElement(false);
    setSetSelectedElement(elementId);
  };

  const { setNodeRef } = useDroppable({
    id: 'sorters-container',
  });

  return (
    <div ref={setNodeRef} className="sorter-scroll-wrapper">
      <div className="sorter-list">
        {sorters.map((sorter) => {
          const elementIds = elementNamesBySorter[sorter.sorter_id]?.ids || [];
          const elementNames = elementNamesBySorter[sorter.sorter_id]?.names || [];

          return (
            <SortableSorter key={sorter.sorter_id} sorter={sorter}>
              <div
                onClick={() => handleSorterClick(sorter.sorter_id)}
                className={`sorter-card ${selectedSorters.includes(sorter.sorter_id) ? 'selected-sorter' : ''}`}
              >
                <div
                  className="sorter-title"
                  onDoubleClick={() => handleSorterNameDoubleClick(sorter.sorter_id, sorter.sorter_name)}
                >
                  {editingSorterId === sorter.sorter_id ? (
                    <input
                      value={inputValue ?? ''}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={() => handleSaveSorterName(sorter.sorter_name)}
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

                {elementNames.length > 0 ? (
                  <SortableContext
                    items={elementIds.map(id => `${sorter.sorter_id}-${id}`)}
                    strategy={rectSortingStrategy}
                  >
                    <SorterBox sorterId={sorter.sorter_id}>
                      <div className="element-names">
                        {elementNames.map((name, idx) => {
                          const elementId = elementIds[idx];
                          const isSelected = selectedElementIdsBySorter[sorter.sorter_id]?.includes(elementId);

                          return name && elementId != null ? (
                            <SortableElement
                              key={`${sorter.sorter_id}-${elementId}`}
                              sorterId={sorter.sorter_id}
                              id={elementId}
                              name={name}
                              isSelected={isSelected}
                              onClick={(event) => handleElementClick(elementId, sorter.sorter_id, event)}
                              onContextMenu={(e) => handleContextMenu(e, elementId, name)}
                            />
                          ) : null;
                        })}
                      </div>
                    </SorterBox>



                  </SortableContext>
                ) : (
                  <SorterBox sorterId={sorter.sorter_id}/>


                )}
              </div>
            </SortableSorter>
          );
        })}

        {selectedSorters.length > 0 && (
          <button className="delete-selected-btn" onClick={multiDeleteSorters}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default SorterContainer;
