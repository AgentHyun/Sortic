import React, { useState } from 'react';
import './MainPage.css';
import { Button, Card, message, Modal, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const handleSave = () => {
    message.success("저장되었습니다.");
};

const selectCard = (cardNumber, setSelectedCard) => {
    setSelectedCard(cardNumber);
};

const deleteSelectedCard = (cards, setCards, selectedCard, setSelectedCard) => {
    if (selectedCard === null) {
        message.warning("삭제할 카드를 선택하세요.");
        return;
    }
    const updatedCards = cards.filter(card => card.number !== selectedCard);
    setCards(updatedCards);
    setSelectedCard(null);
    message.success(`${selectedCard}가 삭제되었습니다.`);
};

function MainPage() {
    const [newProductCost, setNewProductCost] = useState('');
    const [cards, setCards] = useState([
   
    ]);
    
    const [selectedCard, setSelectedCard] = useState(null);
    const [newProductName, setNewProductName] = useState('');
    const [newProductQuantity, setNewProductQuantity] = useState('');
    const [newProductImage, setNewProductImage] = useState(null);
    const [newProductCategory, setNewProductCategory] = useState(''); // Selected category state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [sortType, setSortType] = useState(null);
    const [registeredProducts, setRegisteredProducts] = useState([]);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categories, setCategories] = useState([]); // Store categories
    const [searchQuery, setSearchQuery] = useState('');
    const [showReceipt, setShowReceipt] = useState(false);
    const navigate = useNavigate();
    const addCard = () => {
        if (cards.length < 100) {
            setIsModalVisible(true); 
        } else {
            message.warning("카드는 최대 100개까지 추가할 수 있습니다.");
        }
    };

    const openRegisterModal = () => {
        setIsRegisterModalVisible(true);
    };

    const handleRegisterCancel = () => {
        setIsRegisterModalVisible(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProductImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const filteredCards = cards.filter(card => 
        card.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleRegisterOk = () => {
        if (!newProductName || !newProductCost || !newProductImage || !newProductCategory) {
            message.warning("상품 이름, 단가, 사진, 카테고리를 모두 입력하세요.");
            return;
        }

        const newProduct = {
            name: newProductName,
            cost: parseFloat(newProductCost),
            image: newProductImage,
            category: newProductCategory,  // Add category to product
        };

        setRegisteredProducts([...registeredProducts, newProduct]);
        message.success(`${newProductName}이(가) 등록되었습니다.`);

        setNewProductName('');
        setNewProductCost('');
        setNewProductImage(null);
        setNewProductCategory(''); // Reset category after product registration
        setIsRegisterModalVisible(false);
    };

    const handleOk = () => {
        if (!newProductName || !newProductQuantity) {
            message.warning("상품 이름과 수량을 입력하세요.");
            return;
        }
    
        const registeredProduct = registeredProducts.find(product => product.name === newProductName);
    
        if (!registeredProduct) {
            message.warning("등록되지 않은 상품입니다.");
            return;
        }
    
        // 배열이 비어 있을 경우 첫 번째 번호를 1로 설정
        const nextCardNumber = cards.length > 0 ? cards[cards.length - 1].number + 1 : 1;
    
        const newCard = {
            number: nextCardNumber,
            name: newProductName,
            quantity: parseInt(newProductQuantity, 10),
            image: registeredProduct.image,
            cost: registeredProduct.cost
        };
    
        setCards([...cards, newCard]); // Add new card
        message.success(`${newProductName} ${newProductQuantity}개가 추가되었습니다.`);
        setNewProductName('');
        setNewProductQuantity('');
        setIsModalVisible(false);


    };
    
    const handleCancel = () => {
        setIsModalVisible(false); // Close the modal
    };
    const handleNavigate = () => {
   
        navigate('/');
    };

    const openSortModal = () => {
        setIsSortModalVisible(true);
    };

    const handleSortCancel = () => {
        setIsSortModalVisible(false);
    };

    const openCategoryModal = () => {
        setIsCategoryModalVisible(true);
    };

    const handleCategoryCancel = () => {
        setIsCategoryModalVisible(false);
    };

    const handleCategoryOk = () => {
        if (!newCategoryName) {
            message.warning("카테고리 이름을 입력하세요.");
            return;
        }

        setCategories([...categories, newCategoryName]);
        message.success(`${newCategoryName} 카테고리가 등록되었습니다.`);
        setNewCategoryName('');
        setIsCategoryModalVisible(false);
    };
    const totalSum = cards.reduce((total, card) => total + card.cost * card.quantity, 0);
    const sortCards = (type) => {
        let sortedCards;
        if (type === 'name') {
            sortedCards = [...cards].sort((a, b) => a.name.localeCompare(b.name));
            message.success("제품 이름 기준으로 정렬되었습니다.");
        } else if (type === 'quantity') {
            sortedCards = [...cards].sort((a, b) => a.quantity - b.quantity);
            message.success("제품 수량 기준으로 정렬되었습니다.");
        }
        setCards(sortedCards);
        setSortType(type);
        setIsSortModalVisible(false);
    };

    return (
        <div className="MainPage">
            <div className="title" onClick = {handleNavigate}>모두의 주문</div>
            <div className="topMenu">
                <div className="category-button">
                    <Button className="transparent-button" onClick={openCategoryModal}>
                        카테고리
                    </Button>
                </div>
                <div className="customBtn">
                    <Button className="transparent-button">불러오기</Button>
                </div>
                <div className="customBtn">
                <Button className="transparent-button" onClick={() => setShowReceipt(!showReceipt)}>
                {showReceipt ? '영수증 숨기기' : '영수증'}
            </Button>
                </div>
                <div className="customBtn">
                    <Button className="transparent-button" onClick={openRegisterModal}>상품 등록</Button>
                </div>
                <input 
    type="search" 
    className='search-input' 
    value={searchQuery} 
    onChange={(e) => setSearchQuery(e.target.value)} 
    placeholder="상품 이름 검색"
/>
                <div className='search-button-section'>
                    <Button className="search-button">검색</Button>
                </div>
                <div className="customBtn">
                    <Button className="transparent-button" onClick={addCard}>카드 추가</Button>
                </div>
                <div className="customBtn">
                    <Button className="transparent-button" onClick={openSortModal}>정렬</Button>
                </div>
                <div className="customBtn">
                    <Button className="transparent-button" onClick={() => deleteSelectedCard(cards, setCards, selectedCard, setSelectedCard)} >
                        삭제
                    </Button>
                </div>
            </div>
            <div className="content">
                <div className="category-section">
                    <div className="category-list">전체 상품</div>
                    {categories.map((category, index) => (
                        <div key={index} className="category-list">{category}</div>
                    ))}
                </div>
                <div className="card-section">
                <div className="card-container">
    {filteredCards.map((card, index) => (
        <Card
            key={index}
            className={`card-list ${selectedCard === card.number ? 'selected' : ''}`}
            onClick={() => selectCard(card.number, setSelectedCard)}
        >
            {card.image && <img src={card.image} alt="product" style={{ width: 100, height: 100, objectFit: 'cover' }} />}
            <div className='count'>{card.name}</div>
            <div className='count'>{`수량: ${card.quantity}`}</div>
            <div className='count'>{`총 비용: ${(card.cost * card.quantity).toLocaleString()}`}</div>
        </Card>
    ))}
</div>
                </div>
            </div>

            {/* 상품 등록 모달 */}
            <Modal
                title="상품 등록"
                visible={isRegisterModalVisible}
                onOk={handleRegisterOk}
                onCancel={handleRegisterCancel}
                okText="등록"
                cancelText="닫기"
                className="Modal"
                width={600}
                bodyStyle={{ height: '400px', overflow: 'auto' }}
            >
                <div className="modal-content">
                    <div className="input-container">
                        <Input
                            placeholder="상품 이름"
                            value={newProductName}
                            onChange={(e) => setNewProductName(e.target.value)}
                            style={{width: '500px', height: 40, marginBottom: 15 }}
                        />
                    </div>
                    <div className="input-container">
                        <Input
                            placeholder="상품 단가"
                            type="number"
                            value={newProductCost}
                            onChange={(e) => setNewProductCost(e.target.value)}
                            style={{ width: '500px', height: 40, marginBottom: 15 }}
                        />
                    </div>
                    <Select
                        placeholder="카테고리 선택"
                        value={newProductCategory || undefined}  // null이나 빈 문자열을 처리
                        onChange={setNewProductCategory}
                        style={{ marginLeft : '30px',width: '500px', height: 40, marginBottom: 15 }}
                    >
                        {categories.map((category, index) => (
                            <Option key={index} value={category}>{category}</Option>
                        ))}
                    </Select>
                    <div className="input-container">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ marginBottom: 15 }}
                        />
                        {newProductImage && (
                            <div style={{ marginTop: 10 }}>
                                <img
                                    src={newProductImage}
                                    alt="preview"
                                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* 카테고리 추가 모달 */}
            <Modal
                title="카테고리 추가"
                visible={isCategoryModalVisible}
                onOk={handleCategoryOk}
                onCancel={handleCategoryCancel}
                okText="확인"
                cancelText="닫기"
                className="Modal"
                width={600}
                bodyStyle={{ height: '200px', overflow: 'auto' }}
            >
                <div className="input-container">
                    <Input
                        placeholder="카테고리 이름"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        style={{ width: '500px', height: 40, marginBottom: 15 }}
                    />
                </div>
            </Modal>

            {/* 카드 추가 모달 */}
            <Modal
                title="카드 추가"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="추가"
                cancelText="취소"
                className="Modal"
                width={600}
                bodyStyle={{ height: '400px', overflow: 'auto' }}
            >
                <div className="modal-content">
                    <div className="input-container">
                        <Input
                            placeholder="상품 선택"
                            value={newProductName}
                            onChange={setNewProductName}
                            style={{ width: '500px', height: 40, marginBottom: 15 }}>
                    
                        </Input>
                    </div>
                    <div className="input-container">
                        <Input
                            placeholder="수량"
                            type="number"
                            value={newProductQuantity}
                            onChange={(e) => setNewProductQuantity(e.target.value)}
                            style={{ width: '500px', height: 40, marginBottom: 15 }}
                        />
                    </div>
                </div>
            </Modal>

            {/* 정렬 모달 */}
            <Modal
                title="정렬 옵션"
                visible={isSortModalVisible}
                onOk={() => sortCards(sortType)}
                onCancel={handleSortCancel}
                okText="확인"
                cancelText="닫기"
                className="Modal"
                width={600}
                bodyStyle={{ height: '150px', overflow: 'auto' }}
            >
                <div className="modal-content">
                    <Button
                        style={{ margin: '10px' }}
                        onClick={() => setSortType('name')}
                    >
                        제품 이름 기준 정렬
                    </Button>
                    <Button
                        style={{ margin: '10px' }}
                        onClick={() => setSortType('quantity')}
                    >
                        수량 기준 정렬
                    </Button>
                </div>
            </Modal>
        
        {/* 주문표 섹션 */}
        {showReceipt && (
                <div className="order-table-section">
                    <h3 className='table-title'>주문표</h3>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>수량</th>
                                <th>단가</th>
                                <th>합계</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.map((card, index) => (
                                <tr key={index}>
                                    <td>{card.name}</td>
                                    <td>{card.quantity}</td>
                                    <td>{card.cost.toLocaleString()}</td>
                                    <td>{(card.cost * card.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="total-sum">
                        <strong>총합: {totalSum.toLocaleString()} 원</strong>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MainPage;
