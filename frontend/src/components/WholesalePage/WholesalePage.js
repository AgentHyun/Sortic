import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, message } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
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
        <h2>
          <strong className="domae">도매 코드</strong>로 연결된<br />정보를 확인해보세요!
        </h2>
        <p>"도매 코드를 등록하면<br />클릭 한 번으로<br />도매인의 Sorter가 조회돼요."</p>
      </div>

      <div className="whole-sale-page">
        <Button
          type={selectedLinkId ? 'default' : 'primary'}
          danger={!!selectedLinkId}
          icon={selectedLinkId ? <MinusOutlined /> : <PlusOutlined />}
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
