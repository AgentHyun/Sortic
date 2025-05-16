import React, { useState, useEffect } from 'react';

import { Button, Input, Modal, message } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import axios from 'axios';
import { wholesaleLinksAtom } from '../WholesalePage/atoms/atoms';
import {
  createWholesaleLinkAction,
  fetchWholesaleLinksAction,
  getWholesaleCodeValueByIdAction,
  searchWholesaleCodesAction,
  deleteWholesaleLinkAction,
  getUsernameByUserIdAction,
  updateWholesaleMemoAction,
  getWholesaleMemoAction,
  registerToUserWholesaleCodeAction
} from '../WholesalePage/action/wholesaleAction';
import { isOpenWholesaleAtom } from '../../Atoms/userAtom';
import './css/WholesalePage.css';

const WholesalePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [domainName, setDomainName] = useState('');
  const [previewCode, setPreviewCode] = useState(null);
  const [links] = useAtom(wholesaleLinksAtom);
  const [, createLink] = useAtom(createWholesaleLinkAction);
  const [, fetchLinks] = useAtom(fetchWholesaleLinksAction);
  const [, getCodeById] = useAtom(getWholesaleCodeValueByIdAction);
  const [previewList, setPreviewList] = useState([]);
  const [, searchCodes] = useAtom(searchWholesaleCodesAction);
  const [codeValuesById, setCodeValuesById] = useState({});
  const [deleteLink, setDeleteLink] = useAtom(deleteWholesaleLinkAction);
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [isOpenWholesale, setIsOpenWholesale] = useAtom(isOpenWholesaleAtom);
  const [, getUsernameByUserId] = useAtom(getUsernameByUserIdAction);
  const [usernamesById, setUsernamesById] = useState({});
  const [, getMemo] = useAtom(getWholesaleMemoAction);
  const [, updateMemo] = useAtom(updateWholesaleMemoAction);
  const [, registerToUserCode] = useAtom(registerToUserWholesaleCodeAction);
  const [memoTexts, setMemoTexts] = useState({});
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [showHintCard, setShowHintCard] = useState(false);
  useEffect(() => {
    fetchLinks();
    setIsOpenWholesale(true);
  }, []);

  useEffect(() => {
    const fetchUsernames = async () => {
      const newMap = { ...usernamesById };
      const fetchPromises = previewList.map(async (item) => {
        if (item?.userId && !newMap[item.userId]) {
          const username = await getUsernameByUserId(item.userId);
          if (username) newMap[item.userId] = username;
        }
      });
      await Promise.all(fetchPromises);
      setUsernamesById(newMap);
    };
    if (Array.isArray(previewList) && previewList.length > 0) fetchUsernames();
  }, [previewList]);

  useEffect(() => {
    const keyword = domainName.trim();
    if (isOpenWholesale && keyword.length >= 1) {
      searchCodes(keyword).then(setPreviewList);
    } else {
      setPreviewList([]);
    }
  }, [domainName, isOpenWholesale]);

  useEffect(() => {
    const fetchCodes = async () => {
      const newCodes = {};
      for (const link of links) {
        const id = link?.wholesaleCodeId;
        if (id && !codeValuesById[id]) {
          const code = await getCodeById(id);
          if (code !== null) newCodes[id] = code;
        }
      }
      if (Object.keys(newCodes).length > 0) {
        setCodeValuesById((prev) => ({ ...prev, ...newCodes }));
      }
    };
    if (links.length > 0) fetchCodes();
  }, [links]);


  useEffect(() => {
    const fetchAllMemos = async () => {
      const newMemos = {};
      for (const link of links) {
        const memo = await getMemo(link.wholesaleLinkId);
        newMemos[link.wholesaleLinkId] = memo || '';
      }
      setMemoTexts(newMemos);
    };
    if (links.length > 0) fetchAllMemos();
  }, [links]);

  const handleSave = (id) => {
    if (id && memoTexts[id] !== undefined) {
      updateMemo({ wholesaleLinkId: id, wholesaleMemo: memoTexts[id] });
      setEditingMemoId(null);
    }
  };
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowHintCard(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleAddClick = () => setModalVisible(true);

  const handleOk = async () => {
    if (!domainName.trim()) {
      message.warning('도매 코드를 입력해주세요.');
      return;
    }
    await createLink({ wholesaleCode: domainName });
    setModalVisible(false);
    setDomainName('');
    setPreviewCode(null);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setDomainName('');
    setPreviewCode(null);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '도매 링크 삭제',
      content: '정말 이 도매 링크를 삭제하시겠습니까?',
      onOk: () => {

        setDeleteLink(id);
        setSelectedLinkId(null);
      },
      okText: '삭제',
      cancelText: '취소',
      okButtonProps: {
        className: 'custom-delete-ok',
      },
    });
  };

  return (
    <div className="whole-sale-page-container">
      <div className="info-section">

        <div className="typewriter">
          <div className="slide"><i></i></div>
          <div className="paper"></div>
          <div className="keyboard"></div>
        </div>

        <h2>
          <strong className="domae">도매 코드</strong>로 연결된<br/>정보를 확인해보세요!
        </h2>
        <button className="faq-button" onClick={() => setShowHintCard(!showHintCard)}> {/* ✅ 클릭 시 모달 */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M80 160c0-35.3 28.7-64 64-64h32c35.3 0 64 28.7 64 64v3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74V320c0 17.7 14.3 32 32 32s32-14.3 32-32v-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7V160c0-70.7-57.3-128-128-128H144C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
          </svg>
          <span className="tooltip">HINT</span>
        </button>
      </div>
      {showHintCard && (
        <div className="custom-hint-overlay">
          <div className="cards">
            <div className="card first">
              <p className="first-tip">Connect</p>
              <p className="first-second-text"><span className="green-color">+CODE</span>를 눌러 도매 상인의 코드를 추가해요</p>
            </div>
            <div className="card second">
              <p className="second-tip">Select</p>
              <p className="second-second-text">등록된 <span className="yellow-color"> LINK</span>를 눌러 선택해요</p>
            </div>
            <div className="card third">
              <p className="third-tip">Register</p>
              <p className="third-second-text"><span className="orange-color">REGISTER</span>를 눌러 내 링크에 등록해요</p>
            </div>


          </div>
          <button className="hint-close-button" onClick={() => setShowHintCard(false)}>
            ×
          </button>
        </div>

      )}
      <div className="whole-sale-page">
        <Button
          type={selectedLinkId ? 'default' : 'primary'}
          danger={!!selectedLinkId}
          icon={selectedLinkId ? <MinusOutlined/> : <PlusOutlined/>}
          onClick={() => {
            if (selectedLinkId) {
              handleDelete(selectedLinkId);
            } else {
              handleAddClick();
            }
          }}
          size="large"
          block
          className={`add-button-wholesale ${selectedLinkId ? 'delete-mode' : ''}`}
        >
        {selectedLinkId ? 'Code' : 'Code'}
        </Button>
         <div className="link-title">Link</div>
        <div className="wholesale-links-list">
          {Array.isArray(links) && links.length > 0 ? (
            links.map((link) => (
              <div
                key={`link-${link.wholesaleLinkId}`}
                className={`wholesale-ticket ${selectedLinkId === link.wholesaleLinkId ? 'selected' : ''}`}
              >
                <div
                  className="wholesale-ticket"
                  onClick={() => {
                    if (editingMemoId !== null) return;
                    setSelectedLinkId((prev) =>
                      prev === link.wholesaleLinkId ? null : link.wholesaleLinkId
                    );
                  }}
                >
                  <div className="wholesale-link-header">
                    {link.wholesaleName}
                  </div>

                  {editingMemoId === link.wholesaleLinkId ? (
                    <div className="memo-editing-box">
                      <Input.TextArea
                        autoFocus
                        rows={4}
                        value={memoTexts[link.wholesaleLinkId] || ''}
                        onChange={(e) =>
                          setMemoTexts((prev) => ({ ...prev, [link.wholesaleLinkId]: e.target.value }))
                        }
                        onBlur={() => handleSave(link.wholesaleLinkId)}
                        className="memo-textarea"
                      />
                    </div>
                  ) : (
                    <div className="memo-wrapper">
                      <div
                        className="memo-display-box"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingMemoId(link.wholesaleLinkId);
                        }}
                      >
                        <div className="memo-text">
                          {memoTexts[link.wholesaleLinkId] || ''}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="wholesale-empty-message">등록된 도매 링크가 없습니다.</div>
          )}
        </div>

        {selectedLinkId && (
          <div style={{ marginTop: '2rem', width: '100%' }} className='fixed-register-button'>
            <Button
              type="primary"
              block
              className="register-code-button"
              style={{backgroundColor: '#1c283c', color: 'white', fontWeight: '600', height: '48px'}}
              onClick={() => {
                const selectedLink = links.find(link => link.wholesaleLinkId === selectedLinkId);
                if (selectedLink?.wholesaleCodeId) {
                  registerToUserCode(selectedLink.wholesaleCodeId);
                } else {
                  message.warning("도매 코드 정보를 찾을 수 없습니다.");
                }
              }}
            >
            register

            </Button>
          </div>
        )}
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
          placeholder="도매처 이름 또는 코드로 검색"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          className="domain-name-input"
          size="large"
          allowClear
        />
        {isOpenWholesale && (
          previewList.length > 0 ? (
            previewList.map((item) =>
                item && (
                  <div
                    key={item.wholesaleCodeId}
                    className="wholesale-preview-item"
                    onClick={() => setDomainName(item.wholesaleCode.toString())}
                  >
                    🔎 <span className="wholesale-username">{usernamesById[item.userId] || '조회 중...'}</span>{' '}
                    <span className="wholesale-code">({item.wholesaleCode})</span>
                  </div>
                )
            )
          ) : (
            <p style={{ color: '#888', marginTop: '10px' }}>
              등록할 도매 코드를 입력하세요.
            </p>
          )
        )}
      </Modal>
    </div>
  );
};

export default WholesalePage;
