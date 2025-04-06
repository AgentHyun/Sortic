import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { Input, Modal, message , Button} from 'antd';
import { LeftOutlined, RightOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "../css/SorterPage/Sorter.css";
import "../css/SorterPage/Card.css";
import "../css/SorterPage/SorterPage.css";
import "../css/SorterPage/Category.css";
import "../css/SorterPage/Element.css";
import 'font-awesome/css/font-awesome.min.css';
import { Trash } from 'lucide-react';
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
    fadeInOutAtom,
} from '../atoms/atoms';

import {
    fetchCategoriesAction,
    handleCategoryOkAction,
    deleteCategoryAction,
    handleCategoryNameSaveAction,
    handleCategoryNameDoubleClickAction,
    changeCategoryAction,
    fetchFirstCategoryAction, fetchAndNumberCategoriesAction, fetchCategoryByIdAction
} from '../actions/categoryAction';

import {
    fetchElementsByCategoryAction,
    addElementAction,
    handleElementNameChangeAction,
    handleElementDoubleClickAction,
    handleElementOkAction,
    handleElementNameSaveAction,
    setCurrentCategoryAction, setSelectedElementAction,

} from '../actions/elementAction';
import {elementsDataAction} from "../actions/elementsDataAction";
import { toggleSelectElementAction, handleBulkDeleteElementsAction } from '../actions/elementAction';
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
    const [, setHandleElementNameSaveAction] = useAtom(handleElementNameSaveAction);
    const[originalElementName, setOriginalElementName] = useAtom(originalElementNameAtom);
    const [, setHandleElenmentDoubleClick] = useAtom(handleElementDoubleClickAction);
    const[, setSetSelectedElementAction] = useAtom(setSelectedElementAction);
    const [selectedElementId, setSelectedElementId] = useAtom(selectedElementIdAtom);

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

    const [selectedElementIds] = useAtom(selectedElementIdsAtom);
    const [, setToggleSelectElementAction] = useAtom(toggleSelectElementAction);
    const [, handleBulkDeleteElements] = useAtom(handleBulkDeleteElementsAction);
    const [animationClass, setAnimationClass] = useAtom(animationClassAtom);
    const [fadeInOut, setFadeInOut] = useAtom(fadeInOutAtom);
    useEffect(() => {
        setfetchAndNumberCategories(); // 카테고리를 번호와 함께 불러옴
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
            await setfetchAndNumberCategories(); // 최신 카테고리 목록 불러오기

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

            await fetchElementsByCategory(newCategory.category_id);

        } catch (error) {
            console.error('🚨 카테고리 추가 중 오류 발생:', error);
            message.error('카테고리 추가에 실패했습니다.');
        }
    };
    useEffect(() => {
        if (currentCategory) {
            console.log("🚀 currentCategory가 변경됨, 새로운 요소 가져오기:", currentCategory);
            fetchElementsByCategory(currentCategory);
            setFetchCategoryById(currentCategory);
        }
    }, [currentCategory]); // currentCategory가 변경될 때 실행





    const handleCategoryChange = async (direction) => {
        setAnimationClass(direction === "next" ? "slide-out-left" : "slide-out-right");

        setTimeout(() => {
            setChangeCategory(direction);
            setAnimationClass(direction === "next" ? "slide-in-right" : "slide-in-left");
            setFadeInOut(direction === "next" ? "fade-in-out" :"fade-in-out" );
        }, 300); // 애니메이션 시간 (0.3s)

        setTimeout(() => setAnimationClass(""), 600);
        setTimeout(() => setFadeInOut(""), 600);
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
    const handleDeleteCategory = async () => {
        try {
            await setDeleteCategory();
        } catch (error) {
            console.error('카테고리 삭제 에러:', error);
            message.error('카테고리 삭제에 실패했습니다.');
        }
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
        console.log("🔍 선택된 요소 ID:", elementId); // 선택된 ID 확인
        setSelectedElementId(elementId);
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


        } catch (error) {
            console.error("📌 서버 응답 데이터:", error.response?.data || error.message);
        } finally {
            // 입력값이 없든 에러가 나든 무조건 닫기
            message.success("요소 추가가 완료되었습니다!");
            setAttributeModalVisible(false);
        }
    };



    return (

        <div className="sorter-section">
            <div className='sorter-header'>
                <LeftOutlined
                    onClick={() => handleCategoryChange('prev')}
                    style={{ fontSize: '30px' }}
                    className="nav-icon"
                />
                <div className="number-section-left">
                    <h1>{currentCategoryIndex+1}</h1>

                </div>
                <button className="category-btn" onClick={()=>setAddCategoryModalVisible(true)}>
                    +
                </button>

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
                            <span className={`category-name ${animationClass}`}>
{currentCategoryName || '이름 없음'}</span>

                        )}
                    </div>
                </div>
                <button className="category-btn" onClick={handleDeleteCategory}>-</button>
                <div className="number-section-right">
                    <h1>{ currentCategoryIndex + 2}</h1>
                </div>

                <RightOutlined
                    onClick={() => handleCategoryChange('next')}
                    style={{ fontSize: '30px' }}
                    className="nav-icon"
                />


            </div>
            <div className={`box-section-${fadeInOut}`}>

            <div className="box-section">
                    {cards.map((card, index) => (
                        <div
                            className={`category-item ${selectedElementIds.includes(card.elements_name_id) ? 'selected' : ''}`}

                            key={card.elements_name_id || `card-${index}`}

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
            <div className = "element-btn-section">
                <button type="text" className="element-btn" onClick={showAddElmementModal}>+</button>
                <button
                    type="text"
                    className="element-btn-delete"
                    onClick={handleDeleteSelectedElements}
                >
                    <Trash size={20} color="black" />
                </button>
            </div>

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
                        onChange={(e) => setAddElementCost(e.target.value)}

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




        </div>
    );
};

export default SorterPage;