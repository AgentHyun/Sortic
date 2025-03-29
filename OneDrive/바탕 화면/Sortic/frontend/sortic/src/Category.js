import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, Input, message, Select } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
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
    // 새 상태들 추가
    const [isEditingCategory, setIsEditingCategory] = useState(false); // 카테고리 이름 수정 중인지 체크
    const [newCategoryName, setNewCategoryName] = useState(''); // 새로운 카테고리 이름 상태
    const [isEditingElement, setIsEditingElement] = useState(false); // 요소 수정 중인지 체크
    const [newElementName, setNewElementName] = useState(''); // 새로운 요소 이름 상태
    const [editingElementIndex, setEditingElementIndex] = useState(null);
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


    
    const deleteCategory = async () => {
        if (!currentCategory) {
            warning('삭제할 카테고리를 선택해주세요.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8080/api/categories/delete_category', null, {
                params: {
                    category_id: currentCategory, // 현재 선택된 카테고리 ID 전달
                }
            });
    
            success('카테고리가 삭제되었습니다!');
    
            setCategories(prevCategories => prevCategories.filter(category => category.category_id !== currentCategory));
            
            // 카테고리 삭제 후 최신 max, min 카테고리 ID를 가져옵니다.
            await fetchMaxCategoryId();
            await fetchMinCategoryId();
    
            fetchCategoryById(currentCategory);
    
            // 만약 삭제된 카테고리가 현재 선택된 카테고리라면, 다른 카테고리를 선택
            if (currentCategory === response.data.category_id) {
                if (categories.length > 1) {
                    setCurrentCategory(categories[0].category_id);  // 첫 번째 카테고리로 변경
                } else {
                    setCurrentCategory(0);  // 카테고리가 없으면 초기 상태로
                }
            }
    
            setCurrentCategoryName(''); // 카테고리 이름 초기화
            setCards([]); // 관련된 상품 목록 초기화
    
        } catch (error) {
            warning('카테고리 삭제 실패!');
            console.error(error);
        }
    };
    
    const fetchMaxCategoryId = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories/max_category_id');
            console.log("Fetched max_category_id:", response.data); // 응답 데이터 확인
            return response.data; // 최대 category_id 반환
        } catch (error) {
            console.error('최대 카테고리 ID 조회 실패:', error);
            return null;
        }
    };
    
    
    const fetchMinCategoryId = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories/min_category_id');
            return response.data; // 최소 category_id 반환
        } catch (error) {
            console.error('최소 카테고리 ID 조회 실패:', error);
            return null;
        }
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
    
            // 카테고리 추가 후 최신 max, min 카테고리 ID를 가져옵니다.
            await fetchMaxCategoryId();
            await fetchMinCategoryId();
    
            fetchCategoryById(currentCategory);
    
            setCategories([...categories, newCategory]);
            setCurrentCategory(response.data.category_id);
            setCurrentCategoryName(response.data.category_name);
    
            success('카테고리가 추가되었습니다!');
            setAddCategoryModalVisible(false);
            setNewCategory('');
            setCards([]);
            
            const newCategoryId = response.data.category_id;
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

    const changeCategory = async (direction) => {
        let newCategoryId = currentCategory;
        let maxCategoryId = await fetchMaxCategoryId();
        let minCategoryId = await fetchMinCategoryId();
        console.log(maxCategoryId)
        if (direction === 'next') {
            if (newCategoryId >= maxCategoryId) {
                warning("마지막 카테고리입니다!");
                return;
            }
            newCategoryId += 1;
        } else if (direction === 'prev') {
            if (newCategoryId <= minCategoryId) {
                warning("첫 번째 카테고리입니다!");
                return;
            }
            newCategoryId -= 1;
        }
    
        console.log("변경된 카테고리 ID:", newCategoryId);
        setCurrentCategory(newCategoryId);
        fetchCategoryById(newCategoryId);
        
    };
    
    
    const fetchFirstCategory = async (userId) => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories/get_first_category', {
                params: { user_id: userId }
            });
            if (response.data) {
                
                const firstCategory = response.data;
                setCurrentCategory(firstCategory.category_id);
                setCurrentCategoryName(firstCategory.category_name);
                fetchElementsByCategory(firstCategory.category_id); // 첫 번째 카테고리의 요소 불러오기
            } else {
                console.error('첫 번째 카테고리를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('첫 번째 카테고리 조회 실패:', error);
        }
    };
    
    useEffect(() => {
        fetchFirstCategory('user123'); // user123을 실제 로그인한 사용자 ID로 변경
    }, []);
    const handleCategoryNameDoubleClick = () => {
        setIsEditingCategory(true);
        setNewCategoryName(currentCategoryName); // 기존 이름을 입력란에 설정
    };

    const handleCategoryNameChange = (e) => {
        setNewCategoryName(e.target.value);
    };

    const handleCategoryNameSave = async () => {
        if (!newCategoryName) {
            warning('카테고리 이름을 입력하세요.');
            return;
        }

        try {
            // 카테고리 이름 업데이트 API 호출
            const response = await axios.put('http://localhost:8080/api/categories/update_category_name', null, {
                params: {
                    category_id: currentCategory,
                    category_name: newCategoryName,
                }
            });

            success('카테고리 이름이 업데이트되었습니다!');
            setCurrentCategoryName(newCategoryName);
            setIsEditingCategory(false);
        } catch (error) {
            warning('카테고리 이름 업데이트 실패!');
            console.error(error);
        }
    };
    const fetchCategoryById = async (categoryId) => {
        try {
            const response = await axios.get('http://localhost:8080/api/categories/get_category_by_id', {
                params: {
                    user_id: 'user123',
                    category_id: categoryId
                }
            });
    
            console.log("API 응답 데이터:", response.data); // 디버깅용 콘솔 로그
    
            if (response.data) {
                const category = response.data;
                setCurrentCategory(category.category_id);  // ID를 저장
                setCurrentCategoryName(category.category_name);
                setCategories((prevCategories) => [...prevCategories, category.category_name]); // 중복 방지 필요
            } else {
                console.error("카테고리 데이터가 없습니다.");
            }
        } catch (error) {
            console.error('카테고리 조회 실패:', error);
        }
    };
    
    


    
    const handleElementNameSave = async (index) => {
        if (!newElementName) {
            warning('상품 이름을 입력하세요.');
            return;
        }
    
        try {
            const response = await axios.put('http://localhost:8080/api/elements/update_element', null, {
                params: {
                    category_id: currentCategory,  // 쿼리 파라미터로 category_id 전달
                    elements_name: newElementName  // 쿼리 파라미터로 elements_name 전달
                }
            });
    
            success('상품 이름이 업데이트되었습니다!');
            setCards((prevCards) => {
                const updatedCards = [...prevCards];
                updatedCards[index].elements_name = newElementName;  // 수정된 요소 이름 업데이트
                return updatedCards;
            });
            setIsEditingElement(false);  // 수정 완료 후 인풋창 닫기
            setNewElementName('');  // 새로운 이름 초기화
        } catch (error) {
            warning('상품 이름 수정 실패!');
            console.error(error);
        }
    };
    
    // Input 블러 이벤트 처리
    const handleElementNameBlur = () => {
        handleElementNameSave(editingElementIndex);
    };
    
    // Input에서 Enter를 눌렀을 때 처리
    const handleElementNamePressEnter = () => {
        handleElementNameSave(editingElementIndex);
    };
    
    // 요소 이름을 더블클릭하면 입력창으로 바꿔주는 이벤트
    const handleElementNameChange = (e) => {
        setNewElementName(e.target.value);  // 입력된 값을 상태에 저장
    };
    
    // 더블클릭 시 입력창 표시
    const handleElementDoubleClick = (index) => {
        setEditingElementIndex(index);  // 수정할 인덱스를 설정
        setIsEditingElement(true);
        setNewElementName(cards[index].elements_name);  // 기존 이름을 입력란에 설정
    };
    
    
    
    
    

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
           
                <div className='card-header'>
                    
                    
                <LeftOutlined 
    onClick={() => changeCategory('prev')} 
    style={{ fontSize: '30px' }} // Increase the size of the left arrow
/>
                    
                   
                    
                    <button type="text" className="category-btn" onClick={addCategory}>+</button>
                    <div className="category-name" onDoubleClick={handleCategoryNameDoubleClick}>
                        {isEditingCategory ? (
                            <Input
                                value={newCategoryName}
                                onChange={handleCategoryNameChange}
                                onBlur={handleCategoryNameSave}
                                onPressEnter={handleCategoryNameSave}
                                autoFocus
                            />
                        ) : (
                            currentCategoryName
                        )}
                    </div>
                    <button type="text" className="category-btn" onClick={deleteCategory}>-</button>

                    <RightOutlined 
    onClick={() => changeCategory('next')} 
    style={{ fontSize: '30px' }} 
/>
                   
                </div>

                <div className="box-section">
                    <div className="category-box">
                        {cards.map((card, index) => (
                            <div className="category-item" key={index} onDoubleClick={() => handleElementDoubleClick(index)}>
                            <div className="category-item-info">
                                {isEditingElement && newElementName === cards[index].elements_name ? (
                                    <Input
                                    value={newElementName}
                                    onChange={handleElementNameChange}
                                    onBlur={handleElementNameBlur}  // Input 밖으로 클릭 시 저장
                                    onPressEnter={handleElementNamePressEnter}  // Enter 키로 저장
                                    autoFocus
                                />
                                ) : (
                                    <h3>{cards[index].elements_name}</h3>
                                )}
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