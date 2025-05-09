import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import { wholesaleLinksAtom } from '../WholesalePage/atoms/atoms';
import {
  createWholesaleLinkAction,
  fetchWholesaleLinksAction,
  getWholesaleCodeValueByIdAction,
  searchWholesaleCodesAction,
  getUsernameByUserIdAction
} from '../WholesalePage/action/wholesaleAction';
import './css/WholesalePage.css';

const WholesalePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [previewCode, setPreviewCode] = useState(null); // ✅ 코드 미리보기
  const [links] = useAtom(wholesaleLinksAtom);
  const [, createLink] = useAtom(createWholesaleLinkAction);
  const [, fetchLinks] = useAtom(fetchWholesaleLinksAction);
  const [, getCodeById] = useAtom(getWholesaleCodeValueByIdAction); // ✅ 액션 사용
  const [usernamesById, setUsernamesById] = useState({});
  const [, getUsername] = useAtom(getUsernameByUserIdAction);
  const [previewList, setPreviewList] = useState([]);
  const [, searchCodes] = useAtom(searchWholesaleCodesAction);
  const [codeValuesById, setCodeValuesById] = useState({});

  useEffect(() => {
    fetchLinks(); // 페이지 로딩 시 링크 불러오기
  }, []);

  useEffect(() => {
    const fetchUsernames = async () => {
      const newUsernames = {};

      for (const item of previewList) {
        if (item?.userId && !usernamesById[item.userId]) {
          const name = await getUsername(item.userId);
          newUsernames[item.userId] = name || '알 수 없음';
        }
      }

      if (Object.keys(newUsernames).length > 0) {
        setUsernamesById((prev) => ({ ...prev, ...newUsernames }));
      }
    };

    if (previewList.length > 0) {
      fetchUsernames();
    }
  }, [previewList]);

  useEffect(() => {
    const keyword = domainName.trim();
    if (keyword.length >= 1) {
      searchCodes(keyword).then(setPreviewList);
    } else {
      setPreviewList([]);
    }
  }, [domainName]);
  useEffect(() => {
    const fetchCodes = async () => {
      const newCodes = {};

      for (const link of links) {
        const id = link?.wholesaleCodeId;
        if (id && !codeValuesById[id]) {
          const code = await getCodeById(id);
          if (code !== null) {
            newCodes[id] = code;
          }
        }
      }

      if (Object.keys(newCodes).length > 0) {
        setCodeValuesById((prev) => ({ ...prev, ...newCodes }));
      }
    };

    if (links.length > 0) fetchCodes();
  }, [links]);

  const handleAddClick = () => {
    setModalVisible(true);
  };

  const handleOk = async () => {
    if (!domainName.trim()) {
      message.warning('도매 코드를 입력해주세요.');
      return;
    }

    await createLink(domainName);
    setModalVisible(false);
    setDomainName('');
    setPreviewCode(null);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setDomainName('');
    setPreviewCode(null);
  };

  return (
    <div className="whole-sale-page-container">
      <div className="info-section">
        <h2>
          <strong className="domae">도매 코드</strong>로 연결된
          <br />
          정보를 확인해보세요!
        </h2>
        <p>
          "도매 코드를 등록하면
          <br />
          클릭 한 번으로
          <br /> 도매인의 정보가 조회돼요."
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


        <div className="wholesale-links-list">
          {Array.isArray(links) && links.length > 0 ? (
            links.map((link) => (
              <div
                key={`link-${link.wholesaleLinkId}`}
                className="wholesale-link-item"
              >
                🔗 {link.wholesaleName}
                <br />
                 {codeValuesById[link.wholesaleCodeId] || '조회 중...'}
              </div>
            ))
          ) : (
            <div className="wholesale-empty-message">
              등록된 도매 링크가 없습니다.
            </div>
          )}
        </div>


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
        styles={{ body: { padding: '20px 20px' } }}
        className="modal-container"
      >
        <Input
          placeholder="도매 코드 ID를 입력하세요"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          className="domain-name-input"
          size="large"
          allowClear
        />
        {Array.isArray(previewList) && previewList.length > 0 ? (
          previewList.map((item) =>
            item ? (
              <div
                key={item.wholesaleCodeId}
                className="wholesale-preview-item"
                onClick={() => setDomainName(item.wholesaleCode.toString())} // 👈 클릭 시 인풋에 세팅
                style={{
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  marginTop: '6px',
                  background: '#f5f5f5',
                  transition: 'all 0.2s ease',
                }}
              >
                🔎 {item.wholesaleCode} ({usernamesById[item.userId] || '조회 중...'})
              </div>
            ) : null
          )
        ) : (
          <p style={{ color: '#888' }}>검색 결과가 없습니다.</p>
        )}


      </Modal>
    </div>
  );
};

export default WholesalePage;
