import React, { useState, useEffect ,useRef } from 'react';
import { Button, Modal, Card, Input, message, Select } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import card_image from './images/card.png';
import "./Category.css";
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import './Sorter.css';

const { Option } = Select;

function Category() {
    const [messageApi, contextHolder] = message.useMessage();
    const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
    const [addProductModalVisible, setAddProductModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(0);
    const [currentCategoryName, setCurrentCategoryName] = useState('');
    const [currentElementName, setCurrentElementName] = useState('');
    const [updatedSorters, setUpdatedSorters] = useState({});
    const [elementsData, setElementsData] = useState([{ key_name: "", value_name: "" }]);
    const [newProductName, setNewProductName] = useState('');
    const [newProductCost, setNewProductCost] = useState('');
    const [cards, setCards] = useState([]);
    // 새 상태들 추가
    const [isEditingCategory, setIsEditingCategory] = useState(false); // 카테고리 이름 수정 중인지 체크
    const [newCategoryName, setNewCategoryName] = useState(''); // 새로운 카테고리 이름 상태
    const [isEditingElement, setIsEditingElement] = useState(false); // 요소 수정 중인지 체크
    const [newElementName, setNewElementName] = useState(''); // 새로운 요소 이름 상태
    const [editingElementIndex, setEditingElementIndex] = useState(null);
    const [sorterModalVisible, setSorterModalVisible] = useState(false);
    const [sorterName, setSorterName] = useState('');
    const [isEditingSorter, setIsEditingSorter] = useState(false);
    const [newSorterName, setNewSorterName] = useState('');
    const [sorters, setSorters] = useState([]);  // Manage the list of sorters
    const [editingSorterIndex, setEditingSorterIndex] = useState(null);
    const [newProductKey, setNewProductKey] = useState('');
    const [newProductvalue, setNewProductValue] = useState('');

    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
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


    const addSorter = () => {
        // You can create a new sorter object with a unique id or name
        const newSorter = {
            sorter_id: sorters.length + 1,  // For simplicity, the id is the length of the array
            sorter_name: `Sorter ${sorters.length + 1}`,
        };
    
        // Update the sorters state with the new sorter
        setSorters([...sorters, newSorter]);
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
    
            success(`"${currentCategoryName}"을(를) 성공적으로 삭제했습니다.`);

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
    
    


    useEffect(() => {
        console.log("Updated cards:", cards); // cards 상태가 변경된 후에 확인
    }, [cards]);
    
    const handleElementNameSave = async (index) => {
        if (!newElementName) {
            warning('상품 이름을 입력하세요.');
            return;
        }
    
        try {
            // API 호출을 통해 요소 이름을 업데이트
            const response = await axios.put('http://localhost:8080/api/elements/update_element', null, {
                params: {
                    category_id: currentCategory, // category_id
                    elements_name: newElementName, // 수정된 요소 이름
                },
            });
    
            success('상품 이름이 업데이트되었습니다!');
    
            // 상태를 갱신하여 UI에서 바로 변경된 이름이 반영되도록 합니다.
            setCards((prevCards) => {
                const updatedCards = [...prevCards];
                updatedCards[index] = {
                    ...updatedCards[index],
                    elements_name: newElementName, // 이름 업데이트
                };
    
                return updatedCards;
            });

            setCurrentElementName(newElementName); // currentElementName 업데이트
            setIsEditingElement(false); // 수정 모드 종료
            setNewElementName(''); // 입력값 초기화
        } catch (error) {
            warning('상품 이름 수정 실패!');
            console.error(error);
        }
    };
    
    
    

    
    // 요소 이름을 더블클릭하면 입력창으로 바꿔주는 이벤트
    const handleElementNameChange = (e) => {
        setNewElementName(e.target.value);  // 입력된 값을 상태에 저장
    };
    
    const handleElementDoubleClick = (index) => {
        if (index < 0 || index >= cards.length) {
            console.error("Invalid index:", index);
            return;
        }
        
        setEditingElementIndex(index);
        setIsEditingElement(true);
        setNewElementName(cards[index]?.elements_name || ''); // elements_name을 newElementName에 설정
        setCurrentElementName(cards[index]?.elements_name || ''); // currentElementName에 설정
    };
    
    
    
    
    
    // currentCategory가 변경될 때마다 해당 카테고리의 요소를 가져옴
    useEffect(() => {
        if (currentCategory) {
            console.log("현재 카테고리 ID:", currentCategory); // 디버깅 로그
            fetchElementsByCategory(currentCategory);
        }
    }, [currentCategory]); 
    

    const handleSorterNameChange = (e) => {
        setNewSorterName(e.target.value);
    };

    const handleSorterDoubleClick = (index) => {
        setEditingSorterIndex(index);
        setNewSorterName(sorters[index].sorter_name);  // Set existing name for editing
        setIsEditingSorter(true);  // Enable editing
    };

    const handleSorterNameSave = async () => {
        if (!newSorterName) {
            warning('정렬자 이름을 입력하세요.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8080/api/sorters/add_sorter', {
                user_id: 'user123',
                elements_id: null,
                sorter_name: newSorterName,
            });
    
            success('새로운 정렬자가 추가되었습니다!');
            
            const newSorter = response.data; // 서버에서 반환된 새 정렬자 객체
    
            // 기존 sorters 배열을 업데이트하여 반영
            setSorters(prevSorters =>
                prevSorters.map((sorter, idx) => 
                    idx === editingSorterIndex ? { ...sorter, sorter_name: newSorterName } : sorter
                )
            );
            setUpdatedSorters(prevState => ({
                ...prevState,
                [newSorterName]: true,
            }));
        
            // 편집 모드 종료 및 초기화
            setIsEditingSorter(false);
            setEditingSorterIndex(null);
            setNewSorterName('');
        } catch (error) {
            warning('새 정렬자 추가 실패!');
            console.error(error);
        }
    };
    
    

    const handleSorterNameBlur = () => {
        handleSorterNameSave(editingSorterIndex);  // Save when input is blurred
    };
    
    const handleSorterNameKeyPress = (e, index) => {
        if (e.key === 'Enter') {
            handleSorterNameSave(index);  // Save when Enter is pressed
        }
    };
  

   

    const handleInputChange = (index, field, value) => {
        const newElementsData = [...elementsData];
        newElementsData[index][field] = value;
        setElementsData(newElementsData);
    };

    // 새로운 key-value 입력 필드 추가
    const addNewElementField = () => {
        setElementsData([...elementsData, { key_name: "", value_name: "" }]);
    };

    // DB 저장 요청 함수 (MyBatis Mapper와 맞춤)
    const handleAddElement = async () => {
        const formattedData = elementsData.map(element => ({
            elements_name_id: currentElementName,
            key_name: element.key_name,
            value_name: element.value_name
        }));

        try {
            await axios.post("http://localhost:8080/api/elements/addElementData", formattedData);
            alert("저장 성공!");
            setAddProductModalVisible(false);
        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장 실패");
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const scrollWidth = containerRef.current.scrollWidth;
            const containerWidth = containerRef.current.offsetWidth;
            const currentScrollLeft = containerRef.current.scrollLeft;

            // 슬라이드 끝에 도달하면 다시 처음으로 이동
            if (currentScrollLeft >= scrollWidth - containerWidth) {
                containerRef.current.scrollLeft = 0;
            }
        }, 2000);  // 2초마다 체크

        return () => clearInterval(interval); // 컴포넌트가 언마운트 될 때 interval 정리
    }, []);
    return (
        <>
            {contextHolder}
            <div className="card-section">
           
                <div className='card-header'>
                    
                    
                <LeftOutlined 
    onClick={() => changeCategory('prev')} 
    style={{ fontSize: '30px' }} // Increase the size of the left arrow
/>
                    
                   
                    
                    <button type="text" className="category-btn" onClick={addProduct}>+</button>
                    <div className="category-name" onDoubleClick={handleCategoryNameDoubleClick}>
                        {isEditingCategory ? (
                            <input
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
                            {isEditingElement && editingElementIndex === index ? (
                                        <input
                                            value={newElementName}
                                            onChange={handleElementNameChange}
                                            onBlur={() => handleElementNameSave(index)}
                                            onPressEnter={() => handleElementNameSave(index)}
                                            autoFocus
                                        />
                                    ) : (
                                        card.elements_name
                                    )}
                            </div>
                        </div>
                        ))}
                    </div>
                    <button type="text" className="category-btn-box" onClick={addCategory}>+</button>
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
                    okButtonProps={{
                        style: {
                            backgroundColor: '#3b4a4d', // 원하는 색상으로 변경
                            
                        }
                    }}
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
            {elementsData.map((element, index) => (
                <div key={index} >
                    <Input
                        placeholder="속성 입력"
                        value={element.key}
                        onChange={(e) => handleInputChange(index, "key", e.target.value)}
                        style={{ width: 200, marginRight: 12 }}
                    />
                    <Input
                        placeholder="값 입력"
                        value={element.value}
                        onChange={(e) => handleInputChange(index, "value", e.target.value)}
                        style={{ width: 200, marginRight: 12 }}
                    />
                    <Button type="text" className="add-element-btn" onClick={handleAddElement}>+</Button>
                </div>
            ))}
                </Modal>
            </div>
            <button type="text" className="sorter-btn" onClick={addSorter}>Sorter</button>

            <div className='sorter-section'>

          
   
            {/* 슬라이드할 수 있는 컨테이너 */}
            <div
                        className="sorters-container"
                        ref={containerRef}
                    >
                        {sorters.map((sorter, index) => (
                            <div 
                                key={sorter.sorter_id} 
                                className={`sorter-box ${updatedSorters[sorter.sorter_name] ? 'highlight' : ''}`} 
                                onDoubleClick={() => handleSorterDoubleClick(index)}
                            >  
                                {isEditingSorter && editingSorterIndex === index ? (
                                  
                                  <input
                                  value={newSorterName}
                                  onChange={handleSorterNameChange}
                                  onBlur={handleSorterNameBlur}  // Save when input loses focus
                                  onKeyPress={(e) => handleSorterNameKeyPress(e, index)}  // Save when Enter is pressed
                                  autoFocus
                              />
                                ) : (
                                    sorter.sorter_name
                                )}
                                 
                            </div>
                        ))}
                    </div>
              


            </div>
        </>
    );
}

export default Category;