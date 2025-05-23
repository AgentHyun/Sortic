import React, { useEffect, useState } from 'react';
import '../css/SorterPage/WholesalerCodeBox.css';
import { useAtom } from 'jotai';
import {
  generateWholesalerCodeAction,
  cloneUserWithWholesalerCodeAction,
  createWholesaleCodeAction,
  fetchClonedUserIdAction,
  getWholesaleCodesByUserIdAction,
  updateWholesaleCodeByUserIdAction,
  getUserIdsByOwnerUserIdAction,
  getUsernameByUserIdAction
} from '../../WholesalePage/action/wholesaleAction';
import {
  isClonedAtom, selectedUserIdAtom
} from '../atoms/atoms';
import { authUserAtom } from "../../../auth/authAtoms";

const WholesalerCodeBox = () => {
  const [, generateWholesalerCode] = useAtom(generateWholesalerCodeAction);
  const [, cloneUserWithWholesalerCode] = useAtom(cloneUserWithWholesalerCodeAction);
  const [, createWholesaleCode] = useAtom(createWholesaleCodeAction);
  const [, updateWholesaleCodeByUserId] = useAtom(updateWholesaleCodeByUserIdAction);
  const [, getWholesaleCodesByUserId] = useAtom(getWholesaleCodesByUserIdAction);
  const [, getUserIdsByOwner] = useAtom(getUserIdsByOwnerUserIdAction);
  const [, getUsernameById] = useAtom(getUsernameByUserIdAction);

  const [authUser] = useAtom(authUserAtom);
  const [selectedUserId] = useAtom(selectedUserIdAtom);
  const [code, setCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [storeNames, setStoreNames] = useState([]);

  // 도매 코드 불러오기
  useEffect(() => {
    const fetchCode = async () => {
      const userId = authUser?.userId;
      if (!userId) return;

      try {
        const codes = await getWholesaleCodesByUserId(userId);
        if (codes?.length > 0) {
          setCode(codes[0].wholesaleCode);
        }
      } catch (err) {
        console.error("도매 코드 불러오기 실패:", err);
      }
    };
    fetchCode();
  }, [authUser?.userId, selectedUserId]);

  // 업장 리스트 불러오기
  useEffect(() => {
    const fetchStores = async () => {
      const userId = authUser?.userId;
      if (!userId) return;

      try {
        const userIds = await getUserIdsByOwner(userId);
        const names = await Promise.all(userIds.map(id => getUsernameById(id)));
        setStoreNames(names.filter(Boolean));
      } catch (err) {
        console.error("업장 불러오기 실패:", err);
      }
    };
    fetchStores();
  }, [authUser?.userId]);

  const handleGenerate = async () => {
    try {
      const generatedCode = await generateWholesalerCode();
      if (!generatedCode) return;
      setCode(generatedCode);
      await cloneUserWithWholesalerCode(generatedCode);
      await createWholesaleCode(generatedCode);
    } catch (err) {
      console.error("도매 코드 생성 실패:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateWholesaleCodeByUserId({
        userId: authUser?.userId,
        userWholesaleCode: code
      });
      setIsEditing(false);
    } catch (err) {
      console.error("도매 코드 수정 실패:", err);
    }
  };

  return (
    <div className="wholesaler-section-container">
      {/* 도매 코드 박스 */}
      <div className= "wholesale-container-section">
        <h2 className="order-title-code">나만의 <span className="gold">도매 코드</span>를 만들어보세요</h2>
        <div className="wholesale-container">
        <div className="wholesale-label">도매 코드</div>

        {!code && (
          <button className="generate-btn" onClick={handleGenerate}>
            생성
          </button>
        )}

        {code && !isEditing && (
          <div className="code-edit-row">
            <div className="wholesale-code-number">{code}</div>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              수정
            </button>
          </div>
        )}

        {code && isEditing && (
          <div className="code-edit-row">
            <input
              className="wholesale-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button className="edit-btn" onClick={handleUpdate}>
              저장
            </button>
          </div>
        )}
      </div>
    </div>
      {/* 업장 카드 목록 */}

      <div className = "registered-stores-section">
      <div className="registered-stores-container">
        <h2 className="order-title-store">마우스를 올려 내 도매처를 <span className="gold">등록</span>한<br/><br/><span className="gold">업장 정보</span>를 조회하세요</h2>
        <div className="store-box">
          {storeNames.length === 0 ? (
            <div className="store-item">등록된 업장이 없습니다.</div>
          ) : (
            storeNames.map((name, idx) => (
              <div key={idx} className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <p className="order-title">{name}</p>

                  </div>
                  <div className="flip-card-back">
                    <p className="order-title">{name}</p>
                    <p>{name} 정보</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default WholesalerCodeBox;
