import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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
  getUsernameByUserIdAction,
  getUserProfileByUserIdAction
} from '../../WholesalePage/action/wholesaleAction';
import {
  isClonedAtom, selectedUserIdAtom
} from '../atoms/atoms';
import { authUserAtom } from '../../../auth/authAtoms';

const WholesalerCodeBox = () => {
  const [, generateWholesalerCode] = useAtom(generateWholesalerCodeAction);
  const [, cloneUserWithWholesalerCode] = useAtom(cloneUserWithWholesalerCodeAction);
  const [, createWholesaleCode] = useAtom(createWholesaleCodeAction);
  const [, updateWholesaleCodeByUserId] = useAtom(updateWholesaleCodeByUserIdAction);
  const [, getWholesaleCodesByUserId] = useAtom(getWholesaleCodesByUserIdAction);
  const [, getUserIdsByOwner] = useAtom(getUserIdsByOwnerUserIdAction);
  const [, getUsernameById] = useAtom(getUsernameByUserIdAction);
  const [, getUserProfile] = useAtom(getUserProfileByUserIdAction);

  const [authUser] = useAtom(authUserAtom);
  const [selectedUserId] = useAtom(selectedUserIdAtom);
  const [code, setCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [storeProfiles, setStoreProfiles] = useState([]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return '전화번호 없음';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  };

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

  useEffect(() => {
    const fetchStores = async () => {
      const userId = authUser?.userId;
      if (!userId) return;
      try {
        const userIds = await getUserIdsByOwner(userId);
        if (!userIds || userIds.length === 0) {
          setStoreProfiles([]);
          return;
        }
        const profiles = await Promise.all(
          userIds.map(async (id) => {
            const username = await getUsernameById(id);
            const profile = await getUserProfile(id);
            return { id, username, ...profile };
          })
        );
        setStoreProfiles(profiles.filter(p => p.username));
      } catch (err) {
        console.error("업장 정보 불러오기 실패:", err);
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="wholesaler-section-container">
      <div className="wholesale-container-section">
        <h2 className="order-title-code">나만의 <span className="gold">도매 코드</span>를 만들어보세요</h2>
        <div className="wholesale-container">
          <div className="wholesale-label">도매 코드</div>
          {!code && (
            <button className="generate-btn" onClick={handleGenerate}>생성</button>
          )}
          {code && !isEditing && (
            <div className="code-edit-row">
              <div className="wholesale-code-number">{code}</div>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>수정</button>
            </div>
          )}
          {code && isEditing && (
            <div className="code-edit-row">
              <input
                className="wholesale-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button className="edit-btn" onClick={handleUpdate}>저장</button>
            </div>
          )}
        </div>
      </div>

      <div className="registered-stores-section">
        <div className="registered-stores-container">
          <h2 className="order-title-store">
            마우스를 올려 내 도매처를 <span className="gold">등록</span>한<br /><br />
            <span className="gold">업장 정보</span>를 조회하세요
          </h2>
          {storeProfiles.length === 0 ? (
            <div className="store-item">등록된 업장이 없습니다</div>
          ) : (
            <Slider {...sliderSettings}>
              {storeProfiles.map((store, idx) => (
                <div key={idx} className="order-bill-container">
                  <div className="flip-card">
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <p className="order-title">{store.username}</p>
                      </div>
                      <div className="flip-card-back">
                        <p className="order-title">{store.username}</p>
                        <p className="back-info">📞 {formatPhoneNumber(store.phone)}</p>
                        <p className="back-info">{store.email || '이메일 없음'}</p>
                        <p className="back-info">{store.region || '지역 정보 없음'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
};

export default WholesalerCodeBox;
