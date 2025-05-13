import React, { useState, useEffect, useRef } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAtom, useSetAtom} from 'jotai';
import {Input, Modal, message, Dropdown, Button, Popover, Tooltip, Typography, Menu} from 'antd';
import {  DeleteOutlined, PlusOutlined, } from "@ant-design/icons";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import {DndContext, DragOverlay, PointerSensor} from '@dnd-kit/core';
import {SortableContext, arrayMove, } from '@dnd-kit/sortable';
import { useSensors, useSensor,} from '@dnd-kit/core';

import ContextMenu from "./contextMenu"
import ElementDetailModal from "./ElementDetailModal"
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "../css/SorterPage/Sorter.css";
import "../css/SorterPage/SorterPage.css";
import "../css/SorterPage/Category.css";
import "../css/SorterPage/Element.css";
import "../css/SorterPage/ContextMenu.css"
import 'font-awesome/css/font-awesome.min.css';
import { Trash,X } from 'lucide-react';

import SorterContainer from './SorterContainer';
import {
  addCategoryModalVisibleAtom,
  addElementModalVisibleAtom,
  newCategoryAtom,
  categoriesAtom,
  currentCategoryAtom,
  currentCategoryNameAtom,
  isEditingCategoryAtom,
  newCategoryNameAtom,
  currentElementNameAtom,
  isEditingElementAtom,
  editingElementIndexAtom,
  elementsDataAtom,
  newElementNameAtom,
  addElementNameAtom,
  addElementCostAtom,
  addElementKeyAtom,
  addElementValueAtom,
  cardsAtom,
  sortersAtom,
  selectedElementIdAtom,
  originalElementNameAtom, currentIndexAtom,
  attributeModalVisibleAtom, keyValuePairsAtom, addedElementIdAtom,
  selectedElementIdsAtom, animationClassAtom,
  fadeInOutAtom, newElementPriceAtom, popoverVisibleAtom, costErrorAtom,
  editedSorterNameAtom, edtingSorterIdAtom,
  selectedSortersAtom, elementsRefreshTriggerAtom,
  oldSorterNameAtom, activeCardAtom, selectedElementNamesBySorterAtom, elementNamesBySorterAtom,
  isDraggingElementsAtom, sorterNameByIdAtom, elementsIdListAtom, selectedUserIdAtom, selectedUserNameAtom

} from '../atoms/atoms';


import {
  fetchCategoriesAction,
  handleCategoryOkAction,
  deleteCategoryAction,
  handleCategoryNameSaveAction,
  handleCategoryNameDoubleClickAction,
  changeCategoryAction,
  fetchFirstCategoryAction, fetchAndNumberCategoriesAction, fetchCategoryByIdAction,
  fetchCategoryCountAction
} from '../actions/categoryAction';

import {
  fetchElementsByCategoryAction,
  addElementAction,

  handleElementDoubleClickAction,

  handleElementNameSaveAction,
  setSelectedElementAction,
  openContextMenuAction,  toggleSelectElementAction, handleBulkDeleteElementsAction,
  fetchElementNameByIdAction

} from '../actions/elementAction';

import {elementsDataAction} from "../actions/elementsDataAction";
import {
  addSorterAction, deleteSorterAction, fetchSortersByUserAction, updateSorterNameAction, deleteMultipleSortersAction
  , moveElementToSorterAction, getSorterNameByIdAction, getElementsIdBySorterIdAction
} from '../actions/sorterAction';

import {addBillElementAction, addBillElementsAction, fetchBillsAction} from "../../BillPage/actions/billElementAction";
import { authUserAtom } from '../../../auth/authAtoms';
import BillPage from "../../BillPage/components/BillPage";

import {closestCenter} from "@dnd-kit/core";
import {rectSortingStrategy} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import WholeSale from "../../WholesalePage/WholesalePage";
import {fetchWholesaleLinksAction, getUserIdByLinkNameAction} from "../../WholesalePage/action/wholesaleAction";
import {wholesaleLinksAtom} from "../../WholesalePage/atoms/atoms";


const { Title } = Typography;
const SorterPage = () => {
  const [editingElementIndex, setEditingElementIndex] = useAtom(editingElementIndexAtom);
  const [isEditingElement, setIsEditingElement] = useAtom(isEditingElementAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [currentCategory, setCurrentCategory] = useAtom(currentCategoryAtom);
  const [currentCategoryName, setCurrentCategoryName] = useAtom(currentCategoryNameAtom);
  const [newCategory, setNewCategory] = useAtom(newCategoryAtom);
  const [isEditingCategory, setIsEditingCategory] = useAtom(isEditingCategoryAtom);
  const [newCategoryName, setNewCategoryName] = useAtom(newCategoryNameAtom);
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useAtom(addCategoryModalVisibleAtom);
  const [cards, setCards] = useAtom(cardsAtom);
  const [newElementName, setNewElementName] = useAtom(newElementNameAtom);
  const [currentElementName, setCurrentElementName] = useAtom(currentElementNameAtom);
  const [fetchCategories, setFetchCategories] = useAtom(fetchCategoriesAction);

  const [, setHandleCategoryOk] = useAtom(handleCategoryOkAction);
  const [, setDeleteCategory] = useAtom(deleteCategoryAction);
  const [, setHandleCategoryNameSave] = useAtom(handleCategoryNameSaveAction);
  const [, setHandleCategoryNameDoubleClick] = useAtom(handleCategoryNameDoubleClickAction);
  const [, setChangeCategory] = useAtom(changeCategoryAction);
  const [, setFetchFirstCategory] = useAtom(fetchFirstCategoryAction);
  const fetchCategoryCount = useSetAtom(fetchCategoryCountAction);


  const [, setHandleElementNameSaveAction] = useAtom(handleElementNameSaveAction);
  const[originalElementName, setOriginalElementName] = useAtom(originalElementNameAtom);
  const [, setHandleElenmentDoubleClick] = useAtom(handleElementDoubleClickAction);
  const[, setSetSelectedElementAction] = useAtom(setSelectedElementAction);
  const [selectedElementId, setSelectedElementId] = useAtom(selectedElementIdAtom);
  const [, openContextMenu] = useAtom(openContextMenuAction);
  const [newElementPrice, setNewElementPrice] = useAtom(newElementPriceAtom);
  const [, setIsDraggingElements] = useAtom(isDraggingElementsAtom);


  const[, setAddElement] = useAtom(addElementAction);
  const [addElementName, setAddElementName] = useAtom(addElementNameAtom);
  const [addElementCost, setAddElementCost] = useAtom(addElementCostAtom);
  const [addElementKey, setAddElementKey] = useAtom(addElementKeyAtom);
  const [addElementValue, setAddElementValue] = useAtom(addElementValueAtom);
  const[addElementModalVisible, setAddElementModalVisible] = useAtom(addElementModalVisibleAtom);
  const [,setfetchAndNumberCategories] = useAtom(fetchAndNumberCategoriesAction);
  const[, setfetchElementsByCategoryId] = useAtom(fetchElementsByCategoryAction);
  const[, setFetchCategoryById] = useAtom(fetchCategoryByIdAction);
  const[currentCategoryIndex, setCurrentCategoryIndex] = useAtom(currentIndexAtom);
  const [elementsData, setElementsData] = useAtom(elementsDataAtom);
  const [attributeModalVisible, setAttributeModalVisible] = useAtom(attributeModalVisibleAtom)
  const [keyValuePairs, setKeyValuePairs] = useAtom(keyValuePairsAtom);
  const [, addElementData] = useAtom(elementsDataAction);
  const [addedElementId, setAddedElementId] = useAtom(addedElementIdAtom);
  const [costError, setCostError] = useAtom(costErrorAtom);
  const [elementsRefreshTrigger, setElementsRefreshTrigger] = useAtom(elementsRefreshTriggerAtom);
  const [fetchElementNameById, setFetchElementNameById] = useAtom(fetchElementNameByIdAction);
  const [activeCard, setActiveCard] = useAtom(activeCardAtom);
  const [selectedElementIds] = useAtom(selectedElementIdsAtom);

  const [, setToggleSelectElementAction] = useAtom(toggleSelectElementAction);
  const [, handleBulkDeleteElements] = useAtom(handleBulkDeleteElementsAction);
  const [animationClass, setAnimationClass] = useAtom(animationClassAtom);
  const [fadeInOut, setFadeInOut] = useAtom(fadeInOutAtom);
  const [, setAddSorter] = useAtom(addSorterAction);
  const [sorters, setSorters] = useAtom(sortersAtom);

  const [, setDeleteSorter] = useAtom(deleteSorterAction);
  const[, setFetchSortersByUser] = useAtom(fetchSortersByUserAction);
  const[ oldSorterName, setOldSorterName] = useAtom(oldSorterNameAtom);
  const [selectedElementNamesBySorter, setSelectedElementNamesBySorter] = useAtom(selectedElementNamesBySorterAtom);
  const [elementNamesBySorter, setElementNamesBySorter] = useAtom(elementNamesBySorterAtom);

  //sorter
  const [deleteMultipleSorters, setDeleteMultipleSorters] = useAtom(deleteMultipleSortersAction);
  const [selectedSorters, setSelectedSorters] = useAtom(selectedSortersAtom);
  const [editingSorterId, setEditingSorterId] = useAtom(edtingSorterIdAtom);
  const [inputValue, setInputValue] = useAtom(editedSorterNameAtom);
  const [moveElementToSorter, setMoveElementToSorter] = useAtom(moveElementToSorterAction);
  const [, updateSorterName] = useAtom(updateSorterNameAction)
  const[,setGetSorterNameByIdAction] = useAtom(getSorterNameByIdAction);
  const sorterRef = useRef(null);
  const [arrowHeight, setArrowHeight] = useState(0);
  const [sorterNameById,setSorterNameById] = useAtom(sorterNameByIdAtom);
  const setUpdateSorterName = useSetAtom(updateSorterNameAction);
  const navigate = useNavigate();
  const { confirm } = Modal;
  const [activeId, setActiveId] = useState(null);

  const [authUser, setAuthUser] = useAtom(authUserAtom);
  //sorter-element
  const [getElementsIdBySorterId, setGetElementsIdBySorterId] = useAtom(getElementsIdBySorterIdAction);
  const [elementsIdList, setElemensIdList] = useAtom(elementsIdListAtom);
  //bill
  const [addBillElements, setAddBillElementsAction] = useAtom(addBillElementsAction);
  const [fetchBills, setFetchBills]= useAtom(fetchBillsAction);

  // 도매

  const [, fetchLinks] = useAtom(fetchWholesaleLinksAction);
  const [links] = useAtom(wholesaleLinksAtom);
  const [, getUserIdByLinkName] = useAtom(getUserIdByLinkNameAction);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdAtom);
  const [selectedUserName, setSelectedUserName] = useAtom(selectedUserNameAtom);
  useEffect(() => {
    if (currentCategory !== null) {
      fetchElementsByCategory(currentCategory);
    }
  }, [currentCategory], );


  useEffect(() => {
    // 초기 데이터 로딩
    setfetchAndNumberCategories(); // 카테고리를 번호와 함께 불러옴
    // 화살표 높이 설정
    setFetchSortersByUser();

  }, [selectedUserId]);
  useEffect(() => {
    const fetchData = async () => {
      if (activeId) {
        try {
          // DB에서 activeId에 해당하는 카드 이름을 조회하는 함수
          const response = await setFetchElementNameById(activeId);
        } catch (error) {
          console.error('Error fetching active card:', error);
        }
      }
    };

    fetchData();
  }, [activeId, setFetchElementNameById]);
  useEffect(() => {
    console.log('Active Card:', activeCard);
  }, [activeCard]);
  const fetchElementsByCategory = async() => {

    try {
      await setfetchElementsByCategoryId(currentCategory);
    } catch (error) {
      console.error('첫 번째 카테고리 조회 실패:', error);
      message.error('첫 번째 카테고리 조회에 실패했습니다.');
    }
  }

  const handleAddCategory = async () => {
    try {
      await setHandleCategoryOk(); // 카테고리 추가 실행
      setTimeout(() => {
        setfetchAndNumberCategories(); // 최신 카테고리 목록 불러오기
      }, 100);

      console.log("📌 카테고리 목록 갱신 요청 완료");

      // ✅ 최신 카테고리 목록을 받아오고 로그 출력
      const userId = authUser?.userId;
      const updatedCategories = await setFetchCategories(userId);
      console.log("📋 업데이트된 카테고리 목록:", updatedCategories);

      // 🔴 만약 updatedCategories가 undefined라면, setFetchCategories 내부를 확인해야 함
      if (!updatedCategories) {

        return;
      }

      if (!Array.isArray(updatedCategories) || updatedCategories.length === 0) {

        message.warning("카테고리 목록을 불러오는 데 실패했습니다.");
        return;
      }

      const newCategory = updatedCategories[updatedCategories.length - 1]; // 가장 마지막에 추가된 카테고리
      console.log("✅ 새로 추가된 카테고리:", newCategory);

      if (!newCategory || !newCategory.category_id) {

        return;
      }
      setCurrentCategory(newCategory.category_id);
      setAddCategoryModalVisible(false);



    } catch (error) {
      console.error('🚨 카테고리 추가 중 오류 발생:', error);
      message.error('카테고리 추가에 실패했습니다.');
    }
  };




  const handleCategoryChange = (direction) => {
    setAnimationClass(direction === "next" ? "slide-out-left" : "slide-out-right");

    setTimeout(() => {
      // 카테고리 변경
      setChangeCategory(direction);

      // 들어오는 애니메이션 적용
      setAnimationClass(direction === "next" ? "slide-in-right" : "slide-in-left");
      setFadeInOut("fade-in-out");
    }, 300);


    setTimeout(() => {
      setAnimationClass("");
      setFadeInOut("");
    }, 600);
  };



  const handleDeleteSelectedElements = async () => {
    try {
      await handleBulkDeleteElements();
      setElementsRefreshTrigger(prev => prev + 1);

    } catch (error) {
      console.error("❌ 요소 삭제 실패:", error);
    }
  };

// 카테고리 이름 변경 저장
  const handleSaveCategoryName = async () => {
    try {
      await setHandleCategoryNameSave(); // 카테고리 이름 저장
    } catch (error) {
      console.error('카테고리 이름 변경 에러:', error);
      message.error('카테고리 수정에 실패했습니다.');
    }
  };
  // 카테고리 삭제


  const handleDeleteCategory = () => {
    confirm({
      title: `'${currentCategoryName}' 카테고리를 삭제하시겠습니까?`,
      content: '삭제된 카테고리는 복구할 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      centered: true,
      onOk: async () => {
        try {
          await setDeleteCategory();

          const userId = authUser?.userId;
          const count = await fetchCategoryCount(userId);
          if (count === 0) {
            navigate('/sorterDefaultPage'); // ✅ 원하는 경로로 이동
          }

        } catch (error) {
          console.error('카테고리 삭제 에러:', error);
          message.error('카테고리 삭제에 실패했습니다.');
        }
      },
      onCancel() {
        console.log('카테고리 삭제 취소됨');
      },
    });
  };

  // 요소 더블 클릭 -> 편집 모드 활성화
  const handleDoubleClickElementName = (index) => {
    setHandleElenmentDoubleClick(index);
  };

  // 요소 이름 변경
  const handleElementNameChange = (e) => {
    setNewElementName(e.target.value);
  };




  // 요소 이름 저장
  const handleElementSaveName = async (elementId) => {
    try {
      await setHandleElementNameSaveAction(elementId);
      setIsEditingElement(false);
    } catch (error) {
      console.log("요소 수정 실패");
      message.error("요소 수정 실패");
    }
  };

  const handleCostChange = (e) => {
    let value = e.target.value;

    // 숫자와 쉼표만 허용 (숫자 외의 문자 제거)
    const cleanedValue = value.replace(/[^0-9]/g, '');  // 숫자만 남김
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');  // 3자리마다 쉼표 추가

    // 화면에 표시할 값은 쉼표가 포함된 값으로 설정
    setAddElementCost(formattedValue);



    // 숫자만 입력되도록 체크
    if (value === '' || /^\d+$/.test(cleanedValue)) {
      setCostError('');
    } else {
      if (!costError) {
        message.warning('숫자만 입력 가능합니다.');
        setCostError('숫자만 입력 가능합니다.');
      }
    }


  };


  const addElement = async() =>{
    try {
      await setAddElement();

    } catch (error) {
      console.log("요소 추가 실패");
      message.error("요소 추가 실패");
    }


  }
  const showAddElmementModal = () =>{
    setAddElementModalVisible(true);
  }
/////////////////////////////////////상세 요소 추가////////////////////////////////////////////////////////////



  // 속성 입력값 변경 핸들러
  const handleInputChange = (index, field, value) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs[index] = { ...updatedPairs[index], [field]: value };
    setKeyValuePairs(updatedPairs);
  };

  const addKeyValuePair = () => {
    if (keyValuePairs.length >= 10) {
      message.warning("최대 10개의 속성만 추가할 수 있습니다.");
      return;
    }
    setKeyValuePairs([...keyValuePairs, { key: '', value: '' }]);
  };

  // 속성 제거 핸들러
  const removeKeyValuePair = (index) => {
    const updatedPairs = keyValuePairs.filter((_, i) => i !== index);
    setKeyValuePairs(updatedPairs);
  };

  const handleRegister = async () => {
    try {
      await addElementData();
      message.success("요소 추가가 완료되었습니다!");
    } catch (error) {
      console.error("📌 서버 응답 데이터:", error.response?.data || error.message);
      message.error("요소 추가 실패..😭");
    } finally {
      setAttributeModalVisible(false);
    }
  };

  const [popoverVisible, setPopoverVisible] = useAtom(popoverVisibleAtom);
  const firstCategoryIndex = 0;
  const lastCategoryIndex = categories.length - 1;
  const prevCategoryIndex =
    currentCategoryIndex === 0 ? lastCategoryIndex : currentCategoryIndex - 1;
  const nextCategoryIndex =
    currentCategoryIndex === lastCategoryIndex ? 0 : currentCategoryIndex + 1;
  const isLeftRed =
    prevCategoryIndex === firstCategoryIndex || prevCategoryIndex === lastCategoryIndex;
  const isRightRed =
    nextCategoryIndex === firstCategoryIndex || nextCategoryIndex === lastCategoryIndex;





  useEffect(() => {
    const checkCategoryCount = async () => {
      const userId =  selectedUserId;// 실제 사용자 ID로 대체
      const count = await fetchCategoryCount(userId);

      // if (count === 0) {
      //   navigate('/sorterDefaultPage');
      // }
    };

    checkCategoryCount();
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const height = entries[0].contentRect.height;

      }
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [currentCategory]); // <-- 여기 핵심! category 바뀌면 항상 다시 관찰
  useEffect(() => {
    if (typeof activeCard === 'string' && activeCard.startsWith('sorter-')) {
      const sorterId = activeCard.replace('sorter-', '');
      if (!isNaN(Number(sorterId))) {
        setGetSorterNameByIdAction(Number(sorterId));
      }
    }
  }, [activeCard, setGetSorterNameByIdAction]);



  const sectionRef = useRef(null);
  const addSorter = () =>{
    setAddSorter();
  }
  const deleteSorter = (sorterId) =>{
    setDeleteSorter(sorterId);
  }
  const multiDeleteSorters = () => {
    if (selectedSorters.length === 0) {
      message.warning("삭제할 정렬자를 선택해주세요.");
      return;
    }
    console.log("선택자" + selectedSorters);
    // 삭제 요청
    setDeleteMultipleSorters(selectedSorters);
    // 선택 초기화 (선택된 상태를 관리하는 useState가 있다고 가정)
    setSelectedSorters([]);
  };


  const handleSorterNameDoubleClick = (id, name) => {
    console.log('더블클릭됨:', name); // 👈 로그로 확인
    console.log('더블클릭됨:', id);
    setEditingSorterId(id);
    setInputValue(name);
    setOldSorterName(name);
  };

  const handleSaveSorterName = async () => {
    const value = inputValue?.trim();
    if (!value || !editingSorterId) return;

    const sorterToUpdate = sorters.find(s => s.sorter_id === editingSorterId);
    if (!sorterToUpdate) return;

    const oldName = sorterToUpdate.sorter_name;

    try {
      // 이름 업데이트 요청
      await setUpdateSorterName({
        oldSorterName: oldName,
        newName: value,
      });

      // 상태에서 해당 Sorter만 이름 수정
      const updatedSorters = sorters.map(sorter =>
        sorter.sorter_id === editingSorterId
          ? { ...sorter, sorter_name: value }
          : sorter
      );

      // 중복된 sorter_name 제거 (ID가 다르더라도 이름이 같은 경우는 유지하지 않음)
      const uniqueSorters = updatedSorters.filter(
        (sorter, index, self) =>
          index === self.findIndex(s => s.sorter_name === sorter.sorter_name)
      );

      setSorters(uniqueSorters);
      console.log("기존 이름:", oldName, " → 새 이름:", value);
    } catch (error) {
      console.error('Error updating sorter name:', error);
    }

    setEditingSorterId(null);  // 편집 종료
  };


  const handleSorterClick = (sorter_id) => {
    setSelectedSorters((prevSelected) => {
      const newSelected = prevSelected.includes(sorter_id)
        ? prevSelected.filter((id) => id !== sorter_id) // 선택 해제
        : [...prevSelected, sorter_id]; // 선택

      console.log(newSelected); // 상태 변경 후 상태 출력
      return newSelected;
    });


  };

  // dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;

    // active.id를 문자열로 강제 변환
    const activeIdStr = String(active.id);
    setActiveCard(active.id);
    let extractedId = activeIdStr;

    // 문자열에 '-'가 포함된 경우 split하여 두 번째 값만 추출
    if (activeIdStr.includes('-')) {
      extractedId = activeIdStr.split('-')[1];
    }


    // 추출된 ID를 activeId로 설정
    setActiveId(extractedId);



  };


  const [,setAddBillElement] = useAtom(addBillElementAction);
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    setActiveId(null);
    setActiveId(activeIdStr);

    console.log("액티브 id:", activeIdStr);
    console.log("오버 id:", overIdStr);
    if (
      !(typeof active.id === "string" &&
        typeof over.id === "string" &&
        active.id.includes("-") &&
        over.id.includes("-") &&
        cards.some((c) => c && c.elements_name_id != null))
    ) {
      const oldIndex = cards.findIndex((c) => c && c.elements_name_id === active.id);
      const newIndex = cards.findIndex((c) => c && c.elements_name_id === over.id);
      setCards(arrayMove(cards, oldIndex, newIndex));
    }

    const overId = String(over.id);
    let elementId;


    if (activeIdStr.includes("-")) {
      elementId = activeIdStr.split("-").pop();
    } else {
      elementId = activeIdStr;
    }
    // ✅ sorter → bill : 모든 요소 추가
    if (activeIdStr.startsWith("sorter-") && overIdStr.startsWith("bill-")) {
      const sorterId = activeIdStr.replace("sorter-", "");
      const billId = Number(overIdStr.replace("bill-", ""));

      console.log(`📦 Bill(${billId})에 Sorter(${sorterId})의 모든 요소 추가 시도`);

      try {
        const elementIds = await setGetElementsIdBySorterId(sorterId);

        if (Array.isArray(elementIds) && elementIds.length > 0) {
          const payload = elementIds.map((elementId) => ({
            billId,
            elementsNameId: Number(elementId),
          }));

          await setAddBillElementsAction(payload);
          await setFetchBills(selectedUserId);
          console.log("✅ 요소들 일괄 추가 완료");
        } else {
          console.warn(`⚠️ Sorter(${sorterId})에 요소가 없거나 비정상입니다.`);
        }
      } catch (error) {
        console.error("🔥 요소 일괄 추가 실패", error);
      }
      return;
    }

    // ✅ 요소 → bill : 단일 요소 추가
    if (overIdStr.startsWith("bill-")) {
      const billId = Number(overIdStr.replace("bill-", ""));
      const elementId = activeIdStr.includes("-")
        ? activeIdStr.split("-").pop()
        : activeIdStr;

      console.log(`📦 Bill(${billId})에 요소(${elementId}) 추가 시도`);

      try {
        await setAddBillElement({
          billId,
          elementsNameId: Number(elementId),
        });
        await setFetchBills(selectedUserId);
      } catch (error) {
        console.error("🔥 BillElement 추가 실패", error);
      }
      return;
    }

    // ✅ sorter → sorter : 모든 요소 이동
    if (activeIdStr.startsWith("sorter-") && overIdStr.startsWith("sorter-")) {
      const sourceSorterId = activeIdStr.replace("sorter-", "");
      const targetSorterId = overIdStr.replace("sorter-", "");

      const elementIds = await setGetElementsIdBySorterId(sourceSorterId);
      const targetSorter = sorters.find(
        (s) => String(s.sorter_id) === targetSorterId
      );

      if (!targetSorter) {
        console.log(`⚠️ 정렬자 ID ${targetSorterId}에 해당하는 정렬자 없음`);
        return;
      }

      console.log(`📦 Sorter(${targetSorterId})에 Sorter(${sourceSorterId})의 요소들 추가 시도`);

      try {
        await Promise.all(
          elementIds.map((elementId) =>
            setMoveElementToSorter({
              elementsId: elementId,
              sorterId: targetSorter.sorter_id,
            })
          )
        );

        setSorters((prev) =>
          prev.map((s) =>
            s.sorter_id === targetSorter.sorter_id
              ? {
                ...s,
                elements_id: [...(s.elements_id || []), ...elementIds.map(String)],
              }
              : s
          )
        );
      } catch (error) {
        console.error("🔥 정렬자 간 요소 이동 실패", error);
      }
      return;
    }

    // ✅ 요소 → sorter : 단일 요소 추가
    if (overIdStr.startsWith("sorter-") && !activeIdStr.startsWith("sorter-")) {
      const sorterId = overIdStr.replace("sorter-", "");
      const elementId = activeIdStr.includes("-")
        ? activeIdStr.split("-").pop()
        : activeIdStr;

      const targetSorter = sorters.find(
        (s) => String(s.sorter_id) === sorterId
      );

      if (!targetSorter) {
        console.log(`⚠️ 정렬자 ID ${sorterId}에 해당하는 정렬자 없음`);
        return;
      }

      console.log("📥 요소를 정렬자에 추가");

      try {
        await setMoveElementToSorter({
          elementsId: elementId,
          sorterId: targetSorter.sorter_id,
        });

        setSorters((prev) =>
          prev.map((s) =>
            s.sorter_id === targetSorter.sorter_id
              ? {
                ...s,
                elements_id: [...(s.elements_id || []), elementId],
              }
              : s
          )
        );
      } catch (error) {
        console.error("🔥 요소 이동 실패", error);
      }
      return;
    }

    // ✅ sorter 내부 순서 변경
    if (
      activeIdStr.includes("-") &&
      overIdStr.includes("-")
    ) {
      const activeElementId = activeIdStr.split("-").pop();
      const overElementId = overIdStr.split("-").pop();
      const sorterId = overIdStr.split("-")[0];

      const targetSorter = sorters.find((s) => String(s.sorter_id) === sorterId);
      if (!targetSorter) {
        console.log(`⚠️ 정렬자 ID ${sorterId}에 해당하는 정렬자 없음`);
        return;
      }

      setIsDraggingElements(true);

      try {
        await setMoveElementToSorter({
          elementsId: overElementId,
          sorterId: targetSorter.sorter_id,
        });

        setElementNamesBySorter((prev) => {
          const updated = { ...prev };

          if (updated[sorterId]) {
            const elementIds = [...(updated[sorterId].ids || [])];
            const elementNames = [...(updated[sorterId].names || [])];

            const oldIndex = elementIds.indexOf(Number(activeElementId));
            const newIndex = elementIds.indexOf(Number(overElementId));

            if (oldIndex !== -1 && newIndex !== -1) {
              [elementIds[oldIndex], elementIds[newIndex]] = [
                elementIds[newIndex],
                elementIds[oldIndex],
              ];
              [elementNames[oldIndex], elementNames[newIndex]] = [
                elementNames[newIndex],
                elementNames[oldIndex],
              ];

              updated[sorterId] = {
                ids: elementIds,
                names: elementNames,
              };
            } else {
              console.log("🚨 잘못된 인덱스 - 순서 변경 실패");
            }
          }

          return updated;
        });
      } catch (error) {
        console.error("🔥 정렬자 내 순서 변경 실패", error);
      } finally {
        setIsDraggingElements(false);
      }
    }
  };

  const handleLinkClick = async () => {
    await fetchLinks(); // 링크 조회
    setDropdownVisible(true); // 드롭다운 열기
  };
  const handleMenuClick = async (linkName) => {


    const userId = await getUserIdByLinkName(linkName);
    setSelectedUserName(linkName);

    if (userId) {
      setSelectedUserId(userId); // ✅ authUser.userId 대신 사용 가능

    }
    setfetchAndNumberCategories();

  };


  const menu = (
    <Menu>
      {links.length > 0 ? (
        links.map((link, index) => (
          <Menu.Item key={index} onClick={() => handleMenuClick(link.wholesaleName)}>
            {link.wholesaleName || '이름 없음'}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>도매 링크가 없습니다</Menu.Item>
      )}
    </Menu>
  );
  return (
    <div>



      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={activeId ? [activeId] : []}
          strategy={rectSortingStrategy}
        >
        <div className="sorter-page-section">

          <Dropdown
            overlay={menu}
            trigger={['click']}
            open={dropdownVisible}
            onOpenChange={(visible) => setDropdownVisible(visible)}
            overlayClassName="modern-dropdown"
            placement="bottomCenter"           >
            <Button className="cta" onClick={handleLinkClick}>
              {selectedUserName ? selectedUserName : 'Link'}
            </Button>
          </Dropdown>

          <div className={"sorter-header-section"}>


            {categories.length > 1 && (
              <div className="left-arrow-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  className="arrow-left-btn"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0px',
                    padding: '8px',
                    width: 'auto',

                  }}
                >
                  <ChevronLeft
                    onClick={() => handleCategoryChange('prev')}
                    style={{
                      width: '40px',
                      height: '180px',
                      color: isLeftRed ? '#f5222d' : '#635C3B ',
                      strokeWidth: 2,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                    }}
                  />
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: isLeftRed ? '#f5222d' : '#635C3B ',
                    }}
                    className= 'left-arrow-text'
                  >
                    {prevCategoryIndex + 1}
                  </div>
                </div>
              </div>
            )}


            <div className="sorter-section" ref={sectionRef}>

              <div className='sorter-header'>


                {/* - 삭제 버튼 */}
                <Tooltip title="카테고리 삭제" overlayClassName="custom-tooltip-red" placement="top" arrow={true}>
                  <button className="category-btn-delete" onClick={handleDeleteCategory}>-</button>
                </Tooltip>

                {/* 카테고리 제목 */}
                <Popover
                  content={<span>카테고리 <b>#{currentCategoryIndex + 1}</b></span>}
                  trigger="hover"
                  open={popoverVisible}
                  onOpenChange={(visible) => setPopoverVisible(visible)}
                >
                  <div className={`category-header ${animationClass}`}>
                    <div className="category-name" onDoubleClick={setHandleCategoryNameDoubleClick}>
                      {isEditingCategory ? (
                        <input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onBlur={handleSaveCategoryName}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveCategoryName()}
                          autoFocus
                        />
                      ) : (
                        <span className={`category-name-title ${animationClass}`}>
            {currentCategoryName || ''}
          </span>
                      )}
                    </div>
                  </div>
                </Popover>
                {/* + 추가 버튼 */}
                <Tooltip title="카테고리 추가" overlayClassName="custom-tooltip">
                  <button className="category-btn" onClick={() => setAddCategoryModalVisible(true)}>
                    +
                  </button>
                </Tooltip>



              </div>


              <div
                className="box-section-wrapper"
                style={{
                  maxHeight: "calc(28vh - 80px)",
                  overflowY: "auto",
                  flexGrow: 1,
                  marginLeft: "1vw",
                }}
              >
                <div className="box-section">
                  {cards.map((card) =>
                    card && card.elements_name_id ? (
                      <SortableItem
                        key={card.elements_name_id}
                        card={card}
                        isSelected={selectedElementIds.includes(card.elements_name_id)}

                        isEditing={
                          isEditingElement && editingElementIndex === card.elements_name_id
                        }
                        newElementName={newElementName}
                        handleElementNameChange={handleElementNameChange}
                        handleElementSaveName={handleElementSaveName}
                        handleDoubleClickElementName={handleDoubleClickElementName}
                        openContextMenu={openContextMenu}
                        setNewElementName={setNewElementName}
                        setNewElementPrice={setNewElementPrice}
                        setSelectedElementId={setSelectedElementId}
                        setSetSelectedElementAction={setSetSelectedElementAction}
                        setToggleSelectElementAction={setToggleSelectElementAction}
                      />
                    ) : null
                  )}



                </div>
              </div>
              <DragOverlay>
                {activeCard ? (
                  typeof activeCard === 'string' && activeCard.startsWith('sorter-') ? (
                    <div className="drag-overlay sorter-overlay">
                      {sorterNameById|| '불러오는 중...'}
                    </div>
                  ) : (
                    <div className="category-item dragging">
                      {activeCard}
                    </div>
                  )
                ) : null}
              </DragOverlay>






              <ContextMenu />


              <Modal
                title="카테고리 추가"
                open={addCategoryModalVisible}
                onOk={handleAddCategory}
                onCancel={() => setAddCategoryModalVisible(false)}
              >
                <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
              </Modal>

              <Modal
                title={<div className="element-modal-title">{currentCategoryName}</div>}
                open={addElementModalVisible}
                onOk={addElement}
                okText="Next"
                onCancel={() => setAddElementModalVisible(false)}
                okButtonProps={{
                  className: 'custom-ok-button',
                  style: {
                    backgroundColor: '#3b4a4d', // 원하는 색상으로 변경
                    border : 'none',
                  }
                }}
              >
                <div className="element-name-section">
                  <div className="element-name-title">상품 이름</div>
                  <input
                    className= "element-name-input"
                    placeholder="상품명을 입력하세요"
                    value={addElementName}
                    onChange={(e) => setAddElementName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="element-name-section">
                  <div className="element-name-title">상품 가격</div>
                  <input
                    className= "element-name-input"
                    placeholder="가격을 입력하세요"
                    value={addElementCost}
                    onChange={handleCostChange}

                  />
                </div>

              </Modal>

              <Modal
                title="속성 추가"
                open={attributeModalVisible}
                onCancel={() => setAttributeModalVisible(false)}
                onOk={() => handleRegister()}
                okText="확인"
                cancelText="취소"
                okButtonProps={{
                  className: "attribute-ok-button"
                }}
              >
                {keyValuePairs.map((pair, index) => (
                  <div className= 'elements-data-section' key={index} style={{ display: "flex", marginBottom: 12 }}>
                    <Input
                      placeholder="속성 입력"
                      value={pair.key}
                      onChange={(e) => handleInputChange(index, "key", e.target.value)}
                      style={{ width: 150, marginRight: 10 }}
                    />
                    <Input
                      placeholder="값 입력"
                      value={pair.value}
                      onChange={(e) => handleInputChange(index, "value", e.target.value)}
                      style={{ width: 150, marginRight: 10 }}
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => removeKeyValuePair(index)}
                    />
                  </div>
                ))}
                <Button type="dashed" icon={<PlusOutlined />} onClick={addKeyValuePair} block>
                  속성 추가
                </Button>
              </Modal>
              <ElementDetailModal/>

            </div>





            {categories.length > 1 && (
              <div className="right-arrow-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  className="arrow-right-btn"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0px',
                    padding: '8px',
                    width: 'auto',

                  }}
                >
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: isRightRed ? '#f5222d' : '#635C3B ',

                    }}
                    className = 'right-arrow-text'
                  >
                    {nextCategoryIndex + 1}
                  </div>
                  <ChevronRight
                    onClick={() => handleCategoryChange('next')}
                    style={{
                      width: '40px',
                      height: '180px',
                      color: isRightRed ? '#f5222d' : '#635C3B ',
                      strokeWidth: 2,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
              </div>
            )}

          </div>

          <div className = "element-btn-section">
            <Tooltip title="카테고리 요소 삭제"
                     overlayClassName="custom-tooltip-red"
                     placement="top"
                     arrow={true}>
              <button
                type="text"
                className="element-btn-delete"
                onClick={handleDeleteSelectedElements}
              >
                <Trash className = "trash" size={20} />
              </button>
            </Tooltip>

            <Tooltip title="카테고리 요소 추가"
                     overlayClassName="custom-tooltip"
                     placement="top"
                     arrow={true}>

              <button type="text" className="element-btn" onClick={showAddElmementModal}>+</button>

            </Tooltip>
          </div>
<div className= "sorter-btn-section">
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={selectedSorters.length > 0 ? "delete" : "add"}
              timeout={300}
              classNames="fade"
            >
              {selectedSorters.length > 0 ? (
                <Tooltip title="선택한 정렬자 삭제" overlayClassName="custom-tooltip-red">


                  <button
                    className="delete-selected-btn show-delete-btn"
                    onClick={multiDeleteSorters}
                  >
                    Delete
                  </button>
                </Tooltip>
              ) : (
                <Tooltip title="Sorter 추가"
                         overlayClassName="custom-tooltip"
                         placement="top"
                         arrow={true}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addSorter}
                    className="sorter-effect-btn"
                  >
                    Sorter
                  </Button>
                </Tooltip>
              )}
            </CSSTransition>
          </SwitchTransition>

</div>
          <div className="sorter-sort-section" id="sorter-sort-section" >

              <SorterContainer
                sorters={sorters}
                setSorters={setSorters}
                selectedSorters={selectedSorters}
                handleSorterClick={handleSorterClick}
                deleteSorter={deleteSorter}
                multiDeleteSorters={multiDeleteSorters}
                editingSorterId={editingSorterId}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSaveSorterName={handleSaveSorterName}
                handleSorterNameDoubleClick={handleSorterNameDoubleClick}
              />
          </div>
          <BillPage/>

        </div>



      </SortableContext>
      </DndContext>
    </div>
  );
};

export default SorterPage;
