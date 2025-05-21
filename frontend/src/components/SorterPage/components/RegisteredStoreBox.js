import React, { useEffect, useState } from 'react';
import '../css/SorterPage/WholesalerSection.css';
import { useAtom } from 'jotai';
import { getUserIdsByUserWholesaleCodeAction, getUsernameByUserIdAction } from '../../WholesalePage/action/wholesaleAction';
import { authUserAtom } from '../../../auth/authAtoms';

const RegisteredStoresBox = () => {
  const [storeNames, setStoreNames] = useState([]);
  const [authUser] = useAtom(authUserAtom);
  const [, getUserIdsByCode] = useAtom(getUserIdsByUserWholesaleCodeAction);
  const [, getUsernameById] = useAtom(getUsernameByUserIdAction);

  useEffect(() => {
    const fetchStoreNames = async () => {


      // 1. 도매 코드로 유저 ID 목록 조회
      const userIds = await getUserIdsByCode(authUser.wholesaler_code);
      console.log("유저아이디들" + userIds);
      // 2. 각 유저 ID로 업장명(username) 조회
      const usernames = await Promise.all(
        userIds.map(async (id) => {
          const name = await getUsernameById(id);
          return name;
        })
      );

      // 3. 유효한 이름만 저장
      setStoreNames(usernames.filter(Boolean));
    };

    fetchStoreNames();
  }, [authUser?.wholesaler_code]);

  return (
    <div className="registered-stores-container">
      <div className="registered-title">등록한 업장</div>
      <div className="store-box">
        {storeNames.length === 0 ? (
          <div className="store-item">등록된 업장이 없습니다.</div>
        ) : (
          storeNames.map((name, idx) => (
            <div key={idx} className="store-item">
              {name}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegisteredStoresBox;
