import React, { useState } from 'react';
import { Button, Input, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './css/WholesalePage.css';

const WholesalePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [domainName, setDomainName] = useState('');

  const handleAddClick = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    if (!domainName.trim()) {
      message.warning("도매 코드를 입력해주세요.");
      return;
    }

    console.log("입력된 도메처 이름:", domainName);



    setModalVisible(false);
    setDomainName('');
    message.success("도매 코드가 등록되었습니다.");
  };

  const handleCancel = () => {
    setModalVisible(false);
    setDomainName('');
  };

  return (

    <div className="whole-sale-page-container">

      <div className="info-section">
        <h2><strong className="domae">도매 코드</strong>로 연결된
             <br/>정보를 확인해보세요!</h2>
        <p>
          "도매 코드를 등록하면<br />클릭 한 번으로<br /> 도매인의 정보가 조회돼요."

        </p>
      </div>
      <div className="whole-sale-page">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddClick}
          size="large"
          block
          className="add-button-wholesale"
        >
          도매 코드 추가
        </Button>
      </div>

      <Modal
        title="도매 코드 등록"
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="등록"
        cancelText="취소"
        centered
        width={400}
        bodyStyle={{ padding: '20px 20px' }}
        className="modal-container"
      >
        <Input
          placeholder="도매 코드를 입력하세요"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          className="domain-name-input"
          size="large"
          allowClear
        />
      </Modal>
    </div>
  );
};

export default WholesalePage;
