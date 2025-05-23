import React, { useEffect, useState } from 'react';
import '../css/SorterPage/WholesalerSection.css';
import { useAtom } from 'jotai';
import { getUserIdsByOwnerUserIdAction, getUsernameByUserIdAction } from '../../WholesalePage/action/wholesaleAction';
import { authUserAtom } from '../../../auth/authAtoms';

const RegisteredStoresBox = () => {
  const [storeNames, setStoreNames] = useState([]);
  const [authUser] = useAtom(authUserAtom);
  const [, getUserIdsByOwner] = useAtom(getUserIdsByOwnerUserIdAction);
  const [, getUsernameById] = useAtom(getUsernameByUserIdAction);

  useEffect(() => {
    const fetchStoreNames = async () => {
      if (!authUser?.userId) return;

      // 1. 내 도매 코드 ID를 기반으로 등록된 유저 ID 목록 가져오기
      const userIds = await getUserIdsByOwner(authUser.userId);
      console.log("📦 등록된 유저 ID 목록:", userIds);

      // 2. 각 유저 ID로 업장명(storeName) 조회
      const names = await Promise.all(
        userIds.map(async (id) => {
          const name = await getUsernameById(id);
          return name;
        })
      );

      setStoreNames(names.filter(Boolean));
    };

    fetchStoreNames();
  }, [authUser?.userId]);

  return (
   <div></div>
  );
};

export default RegisteredStoresBox;
