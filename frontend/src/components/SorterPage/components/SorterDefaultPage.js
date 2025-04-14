import React, { useState } from "react";
import { useAtom } from 'jotai';
import "../css/SorterPage/SorterDefaultPage.css";
import { useNavigate } from 'react-router-dom';
import { message, Modal, Input } from 'antd';

import { addCategoryModalVisibleAtom, currentCategoryAtom,newCategoryAtom } from '../atoms/atoms';

import {
    fetchCategoriesAction,
    handleCategoryOkAction,
    fetchAndNumberCategoriesAction,
    fetchCategoryByIdAction,

} from '../actions/categoryAction';

import {
    fetchElementsByCategoryAction
} from '../actions/elementAction';

const SorterDefaultPage = () => {
    const [addCategoryModalVisible, setAddCategoryModalVisible] = useAtom(addCategoryModalVisibleAtom);
    const [, setHandleCategoryOk] = useAtom(handleCategoryOkAction);
    const [, setfetchAndNumberCategories] = useAtom(fetchAndNumberCategoriesAction);
    const [,setFetchCategories] = useAtom(fetchCategoriesAction);
    const [, setFetchElementsByCategory] = useAtom(fetchElementsByCategoryAction);
    const [, setFetchCategoryById] = useAtom(fetchCategoryByIdAction);
    const [, setCurrentCategory] = useAtom(currentCategoryAtom);

    const [newCategory, setNewCategory] = useAtom(newCategoryAtom);
    const navigate = useNavigate();

    const handleClick = () => {
        setAddCategoryModalVisible(true); // 모달만 먼저 띄움
    };

    const handleAddCategory = async () => {
        try {
            if (!newCategory.trim()) {
                message.warning("카테고리 이름을 입력해주세요.");
                return;
            }

            await setHandleCategoryOk(newCategory); // 새 카테고리 이름 전달
            await setfetchAndNumberCategories();

            const updatedCategories = await setFetchCategories('user123');


            const newCat = updatedCategories[updatedCategories.length - 1];
            if (!newCat?.category_id) return;

            setCurrentCategory(newCat.category_id);
            await setFetchElementsByCategory(newCat.category_id);
            await setFetchCategoryById(newCat.category_id);


            setAddCategoryModalVisible(false);  // 모달 닫기
            // 입력 초기화
            navigate('/sorter');
        } catch (error) {
            console.error('🚨 카테고리 추가 중 오류 발생:', error);
            message.error('카테고리 추가에 실패했습니다.');
        }
    };

    return (
        <>
            <div className="sorter-section-default" onClick={handleClick}>
                <a href="#" data-text="Create-Category" className='create-category-title'>Create-Category</a>
            </div>

            <Modal
                title="카테고리 추가"
                open={addCategoryModalVisible}
                onOk={handleAddCategory}
                onCancel={() => {
                    setAddCategoryModalVisible(false);
                    setNewCategory('');
                }}
            >
                <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="카테고리 이름을 입력하세요"
                />
            </Modal>
            <div className="sorter-guide-section">
                <h2 className="guide-title">💡 SorterPage 사용법</h2>
                <ul className="guide-list">
                    <li><strong>카테고리 생성:</strong> 상단의 <strong>Create Category</strong> 버튼을 눌러 새 카테고리를 만드세요.</li>
                    <li><strong>카테고리 이름 수정:</strong> 카테고리 이름을 더블 클릭해 변경할 수 있어요.</li>
                    <li><strong>요소 추가:</strong> 하단의 <code>+</code> 버튼을 눌러 상품 이름과 가격을 추가하세요.</li>
                    <li><strong>속성 입력:</strong> 요소를 우클릭해서 속성(key-value 쌍)을 추가할 수 있어요.</li>
                    <li><strong>삭제:</strong> 카테고리나 요소를 선택 후 <code>-</code> 혹은 휴지통 아이콘으로 삭제하세요.</li>
                </ul>
            </div>

        </>
    );
};

export default SorterDefaultPage;
