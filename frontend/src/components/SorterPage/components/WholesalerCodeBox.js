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
  const [, fetchClonedUsers] = useAtom(fetchClonedUserIdAction);
  const [, getWholesaleCodesByUserId] = useAtom(getWholesaleCodesByUserIdAction);
  const [authUser] = useAtom(authUserAtom);
  const [isCloned, setIsCloned] = useAtom(isClonedAtom);
  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdAtom);
  const [isClonedAtomValue] = useAtom(isClonedAtom);
  const [isClonedLocal, setIsClonedLocal] = useState(isClonedAtomValue);



  const [code, setCode] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCode = async () => {
      const userId = authUser?.userId;
      console.log("이즈 클론드", isCloned);
      if (!userId) return;

      try {
        const codes = await getWholesaleCodesByUserId(userId);
        if (codes?.length > 0) {
          setCode(codes[0].wholesaleCode);
        }
      } catch (err) {
        console.error("초기 코드 불러오기 오류:", err);
      }
    };
    fetchCode();
  }, [selectedUserId]);

  const handleGenerate = async () => {
    try {
      const generatedCode = await generateWholesalerCode();
      if (!generatedCode) return;
      setCode(generatedCode);
      setIsGenerated(true);
      await cloneUserWithWholesalerCode(generatedCode);
      await createWholesaleCode(generatedCode);
    } catch (err) {
      console.error("도매 코드 처리 중 오류:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const userId = authUser?.userId;
      await updateWholesaleCodeByUserId({ userId, userWholesaleCode: code });
      setIsEditing(false);
    } catch (err) {
      console.error("도매 코드 수정 오류:", err);
    }
  };


  return (
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
  );

};

export default WholesalerCodeBox;
