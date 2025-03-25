import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, Input, message, Select } from "antd";
import card_image from './images/card.png';
import "./Category.css";
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';

const { Option } = Select;

function Category() {
    const [messageApi, contextHolder] = message.useMessage();
    const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
    const [addProductModalVisible, setAddProductModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(0);
    const [currentCategoryName, setCurrentCategoryName] = useState('');
    const [newProductName, setNewProductName] = useState('');
    const [newProductCost, setNewProductCost] = useState('');
    const [cards, setCards] = useState([]);

    const success = (msg) => {
        messageApi.open({
            type: 'success',
            content: msg,
            duration: 10,
        });
    };

    const warning = (msg) => {
        messageApi.open({
            type: 'warning',
            content: msg,
        });
    };

    const addCategory = () => {
        setAddCategoryModalVisible(true);
    };

    const addProduct = () => {
        if (!currentCategory) {
            warning('카테고리를 먼저 추가하세요.');
            return;
        }
        setAddProductModalVisible(true);
    };

    const handleCategoryOk = async () => {
        if (!newCategory) {
            warning('카테고리 이름을 입력하세요.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8080/api/categories/add_category', {
                user_id: 'user123',
                category_name: newCategory
            });
    
           
            
        
            setCategories([...categories, newCategory]);
            console.log(response)
            setCurrentCategory(response.data.category_id);
            setCurrentCategoryName(response.data.category_name);
            console.log(response.category_name)
            success('카테고리가 추가되었습니다!');
            setAddCategoryModalVisible(false);
            setNewCategory('');
            setCards([]);
            const newCategoryId = response.data.category_id;
            // Fetch elements for the newly added category
            fetchElementsByCategory(newCategoryId);
    
        } catch (error) {
            warning('카테고리 추가 실패!');
            console.error(error);
        }
    };
    
    
    

    const fetchElementsByCategory = async (categoryId) => {
        try {
            const response = await axios.get('http://localhost:8080/api/elements/get_elements_by_category', {
                params: { category_id: categoryId }
            });
            setCards(response.data);
        } catch (error) {
            console.error('카테고리 요소 조회 실패', error);
        }
    };

    const handleProductOk = async () => {
        if (!newProductName || !newProductCost) {
            warning('상품 이름과 가격을 입력하세요.');
            return;
        }

        const productCost = parseInt(newProductCost, 10);
        if (isNaN(productCost)) {
            warning('가격은 숫자만 입력 가능합니다.');
            return;
        }

        const newProduct = {
            category_id: currentCategory,
            elements_name: newProductName,
            elements_price: parseInt(newProductCost, 10) || 0,
            elements_image: card_image,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/elements/add_element', newProduct);
            success('상품이 추가되었습니다!');
            setCards([...cards, newProduct]); // UI에서 바로 갱신
            setAddProductModalVisible(false);
            setNewProductName('');
            setNewProductCost('');
        } catch (error) {
            warning('상품 추가 실패!');
            console.error(error);
        }
    };

    const changeCategory = (direction) => {
        const currentIndex = categories.indexOf(currentCategory.toString()); // currentCategory와 categories의 타입 맞추기
        if (direction === 'next' && currentIndex < categories.length - 1) {
            setCurrentCategory(categories[currentIndex + 1]);
        } else if (direction === 'prev' && currentIndex > 0) {
            setCurrentCategory(categories[currentIndex - 1]);
        }
    };
    

    useEffect(() => {
        const fetchCategoryById = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/categories/get_category_by_id', {
                    params: {
                        user_id: 'user123',
                        category_id: 1
                    }
                });
    
                console.log("API 응답 데이터:", response.data); // 디버깅용 콘솔 로그
    
                if (response.data) {
                    const category = response.data;
                    setCurrentCategory(category.category_id);  // ID를 저장
                    setCurrentCategoryName(category.category_name)
                    setCategories([...categories, category.category_name]); // 카테고리 목록 추가
                } else {
                    console.error("카테고리 데이터가 없습니다.");
                }
            } catch (error) {
                console.error('카테고리 조회 실패:', error);
            }
        };
    
        fetchCategoryById();
    }, []); // 첫 마운트 시 한 번만 실행
    
    // currentCategory가 변경될 때마다 해당 카테고리의 요소를 가져옴
    useEffect(() => {
        if (currentCategory) {
            console.log("현재 카테고리 ID:", currentCategory); // 디버깅 로그
            fetchElementsByCategory(currentCategory);
        }
    }, [currentCategory]); 
    

   

    return (
        <>
            {contextHolder}
            <div className="card-section">
                <h2 className='title'>Sortic</h2>
                <div className='card-header'>
                    <button 
                        type="text" 
                        className="arrow-btn" 
                        onClick={() => changeCategory('prev')}
                    >
                        <i className="fa fa-arrow-left"></i>
                    </button>
                    
                    <button type="text" className="category-btn" onClick={addCategory}>+</button>
                    <div className="category-title">{currentCategoryName || '오류'}</div>
                    <button type="text" className="category-btn">-</button>

                    <button 
                        type="text" 
                        className="arrow-btn" 
                        onClick={() => changeCategory('next')}
                    >
                        <i className="fa fa-arrow-right"></i>
                    </button>
                </div>

                <div className="box-section">
                    <div className="category-box">
                        {cards.map((card, index) => (
                            <div key={index} className="category-item">
                                <div className="category-item-info">
                                    <h3>{card.elements_name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="text" className="category-btn-box" onClick={addProduct}>+</button>
                </div>

                <Modal
                    title="카테고리 추가"
                    open={addCategoryModalVisible}
                    onOk={handleCategoryOk}
                    onCancel={() => setAddCategoryModalVisible(false)}
                >
                    <Input
                        placeholder="새 카테고리 이름"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                </Modal>

                <Modal
                    title="상품 추가"
                    open={addProductModalVisible}
                    onOk={handleProductOk}
                    onCancel={() => setAddProductModalVisible(false)}
                >
                    <Input
                        placeholder="상품 이름 입력"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        style={{ marginBottom: 15 }}
                    />
                    <Input
                        placeholder="상품 가격 입력"
                        type="number"
                        value={newProductCost}
                        onChange={(e) => setNewProductCost(e.target.value)}
                    />
                </Modal>
            </div>
        </>
    );
}

export default Category;
