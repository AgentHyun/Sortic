import React, { useState, useEffect, useRef } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import { useAtom, useAtomValue, useSetAtom} from 'jotai';
import { Input, Modal, message , Button, Popover, Tooltip, Typography } from 'antd';
import {  DeleteOutlined, PlusOutlined,  LeftOutlined ,RightOutlined} from "@ant-design/icons";
import { ArrowLeftLine, ArrowRightLine, Plus, Minus } from '@rsuite/icons';
import ContextMenu from "./contextMenu"
import ElementDetailModal from "./ElementDetailModal"
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import "../css/SorterPage/Sorter.css";
import "../css/SorterPage/Card.css";
import "../css/SorterPage/SorterPage.css";
import "../css/SorterPage/Category.css";
import "../css/SorterPage/Element.css";
import "../css/SorterPage/ContextMenu.css"
import 'font-awesome/css/font-awesome.min.css';
import { Trash,X ,SlidersHorizontal} from 'lucide-react';

import {
    messageApiAtom,
    contextHolderAtom,
    addCategoryModalVisibleAtom,
    addElementModalVisibleAtom,
    sorterModalVisibleAtom,
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
    updatedSortersAtom,
    sorterNameAtom,
    isEditingSorterAtom,
    newSorterNameAtom,
    sortersAtom,
    editingSorterIndexAtom,
    containerRefAtom,
    isDraggingAtom,
    startXAtom,
    selectedElementIdAtom,
    scrollLeftAtom, originalElementNameAtom, currentIndexAtom,
    attributeModalVisibleAtom, keyValuePairsAtom, addedElementIdAtom, selectedElementAtom,
    selectedElementIdsAtom, animationClassAtom,
    fadeInOutAtom, newElementPriceAtom, popoverVisibleAtom, costErrorAtom,
    editedSorterNameAtom,edtingSorterIdAtom,sorterInputValueAtom, isComittingSorterAtom
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
    handleElementNameChangeAction,
    handleElementDoubleClickAction,
    handleElementOkAction,
    handleElementNameSaveAction,
    setCurrentCategoryAction, setSelectedElementAction,
    openContextMenuAction,  toggleSelectElementAction, handleBulkDeleteElementsAction

} from '../actions/elementAction';

import {elementsDataAction} from "../actions/elementsDataAction";
import {addSorterAction, deleteSorterAction, fetchSortersByUserAction, updateSorterNameAction} from '../actions/sorterAction';

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


    const [selectedElementIds] = useAtom(selectedElementIdsAtom);

    const [, setToggleSelectElementAction] = useAtom(toggleSelectElementAction);
    const [, handleBulkDeleteElements] = useAtom(handleBulkDeleteElementsAction);
    const [animationClass, setAnimationClass] = useAtom(animationClassAtom);
    const [fadeInOut, setFadeInOut] = useAtom(fadeInOutAtom);
    const [, setAddSorter] = useAtom(addSorterAction);
    const [sorters, setSorters] = useAtom(sortersAtom);

    const [, setDeleteSorter] = useAtom(deleteSorterAction);
    const[, setFetchSortersByUser] = useAtom(fetchSortersByUserAction);


    const [isCommittingSorter, setIsCommittingSorter] = useAtom(isComittingSorterAtom);
    const [editingSorterId, setEditingSorterId] = useAtom(edtingSorterIdAtom);
    const [inputValue, setInputValue] = useAtom(editedSorterNameAtom);
    const [, updateSorterName] = useAtom(updateSorterNameAction)
    const sorterRef = useRef(null);
    const [arrowHeight, setArrowHeight] = useState(0);
    const setUpdateSorterName = useSetAtom(updateSorterNameAction);
    const navigate = useNavigate();
    const { confirm } = Modal;

    const settings = {
        dots: true,
        infinite: true, // 무한 루프
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        centerMode: true,
        centerPadding: '40px'
    };
    useEffect(() => {
        if (currentCategory !== null) {
            console.log("🚀 currentCategory가 변경됨ㅋㅋ, 새로운 요소 가져오기:", currentCategory);
            fetchElementsByCategory(currentCategory);
        }
    }, [currentCategory]);

    useEffect(() => {
        // 초기 데이터 로딩
        setfetchAndNumberCategories(); // 카테고리를 번호와 함께 불러옴

        // 화살표 높이 설정
        if (sorterRef.current) {
            const height = sorterRef.current.offsetHeight;
            setArrowHeight(height * 0.85);
        }

        setFetchSortersByUser();



    }, []);


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
            const updatedCategories = await setFetchCategories('user123');
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
                    const userId = 'user123';
                    const count = await fetchCategoryCount(userId);
                    console.log("카테고리 개수 : " + count);
                    if (count === 0) {
                        navigate('/sorterDefaultPage');
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
    const selectedElement = (elementId) => {
        console.log("🔍 선택된 요소 ID!:", elementId); // 선택된 ID 확인
        setSelectedElementId(elementId);
        setAddedElementId(elementId);
        setSetSelectedElementAction(elementId);
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
        const value = e.target.value;
        setAddElementCost(value);

        if (value === '' || /^\d+$/.test(value)) {
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
    const isPrevRed = currentCategoryIndex === 0;
    const isNextRed = currentCategoryIndex === categories.length - 1;
    const categoryCount = categories.length; // 전체 카테고리 수
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






////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const checkCategoryCount = async () => {
            const userId = 'user123'; // 실제 사용자 ID로 대체
            const count = await fetchCategoryCount(userId);
            console.log("카테고리 개수 : " + count);
            if (count === 0) {
                navigate('/sorterDefaultPage');
            }
        };

        checkCategoryCount();
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                const height = entries[0].contentRect.height;
                setArrowHeight(height * 0.95);
            }
        });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, [currentCategory]); // <-- 여기 핵심! category 바뀌면 항상 다시 관찰



    const [sectionHeight, setSectionHeight] = useState(0);
    const sectionRef = useRef(null);
    const addSorter = () =>{
        setAddSorter();
    }
    const deleteSorter = (sorterId) =>{

        setDeleteSorter(sorterId);
    }

    const handleSorterNameDoubleClick = (id, name) => {

        setEditingSorterId(id);  // 편집할 ID 설정
        setInputValue(name);      // 입력 필드에 기존 이름 설정
    };
    const handleSaveSorterName = async (id) => {
        const value = inputValue ?? '';
        if (value.trim()) {
            try {
                await updateSorterName({ sorter_id: id, newName: value });
                console.log('Sorter name updated successfully');
            } catch (error) {
                console.error('Error updating sorter name:', error);
            }
        }
        setEditingSorterId(null);  // 편집 모드 종료
    };




    return (
        <div>
        <div className="sorter-page-section">



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
                                height: `${arrowHeight}px`,
                            }}
                        >
                            <ChevronLeft
                                onClick={() => handleCategoryChange('prev')}
                                style={{
                                    width: '40px',
                                    height: '180px',
                                    color: isLeftRed ? '#f5222d' : '#4C585B',
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
                                    color: isLeftRed ? '#f5222d' : '#4C585B',
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


                        {/* + 추가 버튼 */}
                        <Tooltip title="카테고리 추가" overlayClassName="custom-tooltip">
                            <button className="category-btn" onClick={() => setAddCategoryModalVisible(true)}>
                                +
                            </button>
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
            {currentCategoryName || '로딩중..'}
          </span>
                                    )}
                                </div>
                            </div>
                        </Popover>

                        {/* - 삭제 버튼 */}
                        <Tooltip title="카테고리 삭제" overlayClassName="custom-tooltip" placement="top" arrow={true}>
                            <button className="category-btn" onClick={handleDeleteCategory}>-</button>
                        </Tooltip>


                    </div>


                    <div className={`box-section-${fadeInOut}`}>

                        <div className="box-section">
                            {cards.map((card, index) => (
                                <div
                                    className={`category-item ${selectedElementIds.includes(card.elements_name_id) ? 'selected' : ''}`}

                                    key={card.elements_name_id || `card-${index}`}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        openContextMenu({
                                            x: e.clientX,
                                            y: e.clientY,
                                            target : card,
                                            elementId: card.elements_name_id,
                                        });
                                        setNewElementName(card.elements_name);
                                        setNewElementPrice(card.elements_price);

                                        setSelectedElementId(card.elements_name_id);
                                        setSetSelectedElementAction(card.elements_name_id);
                                    }}
                                    onDoubleClick={() => handleDoubleClickElementName(card.elements_name_id)}
                                    onClick={() => setToggleSelectElementAction(card.elements_name_id)}

                                >
                                    {isEditingElement && editingElementIndex === card.elements_name_id ? (
                                        <input
                                            value={newElementName}
                                            onChange={handleElementNameChange}

                                            onBlur={() => handleElementSaveName(card.elements_name_id)}
                                            onKeyDown={(e) => e.key === "Enter" && handleElementSaveName(card.elements_name_id)}
                                            autoFocus
                                        />
                                    ) : (
                                        card.elements_name
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
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
                            style: {
                                backgroundColor: '#3b4a4d', // 원하는 색상으로 변경

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
                                height: `${arrowHeight}px`,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    color: isRightRed ? '#f5222d' : '#4C585B',

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
                                    color: isRightRed ? '#f5222d' : '#4C585B',
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
                <Tooltip title="카테고리 요소 추가"
                         overlayClassName="custom-tooltip"
                         placement="bottom"
                         arrow={true}>
                    <button type="text" className="element-btn" onClick={showAddElmementModal}>+</button>
                </Tooltip>

                <Tooltip title="카테고리 요소 삭제"
                         overlayClassName="custom-tooltip"
                         placement="bottom"
                         arrow={true}>
                    <button
                        type="text"
                        className="element-btn-delete"
                        onClick={handleDeleteSelectedElements}
                    >
                        <Trash className = "trash" size={20} />
                    </button>
                </Tooltip>
            </div>






            <div className="sorter-sort-section">


                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={addSorter}
                    className="sorter-btn"
                >
                    Sorter 추가
                </Button>



                <div className="sorter-scroll-wrapper">
                    <Slider {...settings}>
                        {sorters.map((sorter) => (
                            <div key={sorter.sorter_id}>
                                <div className="sorter-wrapper">
                                    <div
                                        className={`sorter-title -section`}
                                        onDoubleClick={() => handleSorterNameDoubleClick(sorter.sorter_id, sorter.sorter_name)}
                                    >
                                        {editingSorterId === sorter.sorter_id ? (
                                            <input
                                                autoFocus
                                                value={inputValue ?? ''} // 입력 필드 값 설정
                                                onChange={(e) => setInputValue(e.target.value)} // 값 변경 시 업데이트
                                                onBlur={(e) => {
                                                    // 값이 변경된 경우에만 저장하도록 체크
                                                    if (inputValue !== sorter.sorter_name) {
                                                        handleSaveSorterName(sorter.sorter_id); // 값이 변경되었으면 저장
                                                    } else {

                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleSaveSorterName(sorter.sorter_id);
                                                    } else if (e.key === 'Escape') {
                                                        setEditingSorterId(null); // 또는 입력창을 닫는 함수
                                                    }
                                                }}// Enter 눌렀을 때 저장
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
                </div>
            </div>


        </div>
        </div>
    );
};

export default SorterPage;