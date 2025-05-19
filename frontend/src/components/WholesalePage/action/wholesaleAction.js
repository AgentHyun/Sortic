import { atom } from 'jotai';
import axios from 'axios';
import { message } from 'antd';
import { authUserAtom } from '../../../auth/authAtoms';
import { wholesaleCodesAtom, wholesaleLinksAtom } from '../atoms/atoms';
import {isOpenWholesaleAtom} from "../../../Atoms/userAtom";
import {cardsAtom, currentCategoryAtom} from "../../SorterPage/atoms/atoms";
import {fetchElementsByCategoryAction} from "../../SorterPage/actions/elementAction";
// 도매 코드 생성


// 도매 코드 조회
export const fetchWholesaleCodesAction = atom(null, async (get, set) => {
  const userId = get(authUserAtom)?.userId;
  try {
    const response = await axios.get(`http://localhost:8080/api/wholesale/codes/${userId}`);
    set(wholesaleCodesAtom, response.data);
  } catch (error) {
    console.error("🚨 도매 코드 조회 실패:", error);
    message.error("도매 코드 조회에 실패했습니다.");
  }
});



export const deleteWholesaleLinkAction = atom(null, async (get, set, wholesaleLinkId) => {
  if (!wholesaleLinkId) {
    message.warning("삭제할 링크 ID가 유효하지 않습니다.");
    return;
  }

  try {
    console.log("삭제 아이디" + wholesaleLinkId);
    await axios.delete(`http://localhost:8080/api/wholesale/link/${wholesaleLinkId}`);
    message.success("도매 링크가 삭제되었습니다.");
    await set(fetchWholesaleLinksAction, null); // 리스트 새로고침
  } catch (error) {
    console.error("🚨 도매 링크 삭제 실패:", error);
    message.error("도매 링크 삭제에 실패했습니다.");
  }
});


export const createWholesaleLinkAction = atom(null, async (get, set, { wholesaleCode }) => {
  try {

    const authUser = get(authUserAtom);
    const userId = authUser?.userId;
    await axios.post(
      `http://localhost:8080/api/wholesale/link/by-code`,
      null,
      {
        params: {
          wholesaleCode,
          userId,
        },
      }
    );

    message.success("도매 코드가 등록되었습니다.");
    set(fetchWholesaleLinksAction);

  } catch (error) {
    console.error("🚨 도매 링크 생성 실패:", error);
    if (error.response?.status === 400) {
      message.error(error.response.data);
    } else {
      message.error("도매 링크 등록에 실패했습니다.");
    }

  }
});



// 도매 링크 조회
export const fetchWholesaleLinksAction = atom(null, async (get, set) => {
  const userId = get(authUserAtom)?.userId;
  try {
    const response = await axios.get(`http://localhost:8080/api/wholesale/links/${userId}`);
    set(wholesaleLinksAtom, response.data);

    console.table(get(wholesaleLinksAtom));

  } catch (error) {
    console.error("🚨 도매 링크 조회 실패:");

  }
});

export const fetchUserWholesaleCodesAction = atom(null, async (get, set) => {
  const userId = get(authUserAtom)?.userId;

  if (!userId) {
    console.error("🚨 유저 ID가 없습니다.");
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/wholesale/wholesale-user-code`, {
      params: { userId }
    });



    console.table(response.data); // 확인용


    return response.data;
  } catch (error) {
    console.error("🚨 유저 도매 코드 조회 실패:", error);
  }
});


// 도매 코드 ID로 도매 코드 값 조회
export const getWholesaleCodeValueByIdAction = atom(
  null,
  async (get, set, wholesaleCodeId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/wholesale/code/${wholesaleCodeId}`
      );
      await set(fetchElementsByCategoryAction, get(currentCategoryAtom)); // 필요한 경우

      const code = response.data?.wholesaleCode;
      if (code === undefined) {
        throw new Error("wholesaleCode 응답 누락");
      }

      return code;
    } catch (error) {
      console.error("🚨 도매 코드 값 조회 실패:", error);

      return null;
    }
  }
);
// 포함 검색용 도매 코드 리스트 가져오기
export const searchWholesaleCodesAction = atom(null, async (get, set, keyword) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/wholesale/code/search`, {
      params: { keyword },
    });
    return res.data; // [{ wholesaleCodeId, wholesaleCode, userId }, ...]
  } catch (err) {
    console.error("도매 코드 검색 실패:", err);
    return [];
  }
});
export const getUsernameByUserIdAction = atom(null, async (get, set, userId) => {
  if (!userId) {
    message.error('userId가 없습니다.');
    return null;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/wholesale/username/${userId}`);
    const username = response.data.username;
    return username;
  } catch (error) {
    console.error('🚨 username 조회 실패:', error);
    message.error('도매처 이름(username) 조회에 실패했습니다.');
    return null;
  }
});
export const updateWholesaleMemoAction = atom(null, async (get, set, { wholesaleLinkId, wholesaleMemo }) => {
  try {
    await axios.put(`http://localhost:8080/api/wholesale/link/memo`, {
      wholesaleLinkId,
      wholesaleMemo,
    });
    message.success("메모가 수정되었습니다.");
    // 필요 시 리스트 갱신
    set(fetchWholesaleLinksAction);
  } catch (error) {
    console.error("🚨 메모 수정 실패:", error);
    message.error("도매 메모 수정에 실패했습니다.");
  }
});
export const getWholesaleMemoAction = atom(null, async (get, set, wholesaleLinkId) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/wholesale/link/memo/${wholesaleLinkId}`);
    return res.data.memo; // { memo: "내용" } 형태에서 memo 추출
  } catch (error) {
    console.error("🚨 메모 조회 실패:", error);

    return null;
  }
});
// wholesaleAction.js
export const registerToUserWholesaleCodeAction = atom(null, async (get, set, wholesaleCodeId) => {
  const userId = get(authUserAtom)?.userId;
  if (!userId || !wholesaleCodeId) {
    message.error("사용자 또는 도매 코드 정보가 없습니다.");
    return;
  }

  try {
    await axios.post(`http://localhost:8080/api/wholesale/user-code`, {
      userWholesaleCode: wholesaleCodeId,
      userId : userId,
    });
    message.success("도매 코드가 유저에게 등록되었습니다.");
  } catch (err) {
    console.error("🚨 유저 도매 코드 등록 실패:", err);
    message.error("유저 도매 코드 등록 중 오류가 발생했습니다.");
  }
});
export const getUserIdByLinkNameAction = atom(null, async (get, set, wholesaleName) => {
  if (!wholesaleName || wholesaleName.trim() === "") {
    message.error("도매 링크 이름이 비어 있습니다.");
    return null;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/wholesale/user-id/by-link-name`, {
      params: { name: wholesaleName },
    });

    const userId = response.data.userId;
    return userId;
  } catch (error) {
    console.error("🚨 링크 이름으로 유저 ID 조회 실패:", error);
    if (error.response?.status === 404) {
      message.warning("해당 이름의 링크에 해당하는 유저를 찾을 수 없습니다.");
    } else {
      message.error("유저 ID 조회 중 오류가 발생했습니다.");
    }
    return null;
  }
});
export const fetchUserIdByWholesaleCodeIdAction = atom(
  null,
  async (get, set, codeId) => {
    try {


      const res = await axios.get(
        'http://localhost:8080/api/wholesale/user-id-by-code-id',
        {
          params: { wholesaleCodeId: codeId }
        }
      );


      return res.data; // <-- ❗ 이 값이 실제로 뭐인지 콘솔로 찍어보자
    } catch (e) {
      console.error("🚨 userId 조회 실패:", e);
      return null;
    }
  }
);

export const getUserIdByUsernameAction = atom(null, async (get, set, username) => {
  if (!username || username.trim() === '') {
    message.warning('닉네임이 비어 있습니다.');
    return null;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/wholesale/user-id/by-username`, {
      params: { username },
    });

    const userId = response.data?.userId;
    console.log("🎯 유저 ID 조회 성공:", userId);
    return userId;
  } catch (error) {
    console.error("🚨 username으로 userId 조회 실패:", error);
    if (error.response?.status === 404) {
      message.warning("해당 닉네임의 유저를 찾을 수 없습니다.");
    } else {
      message.error("userId 조회 중 오류가 발생했습니다.");
    }
    return null;
  }
});
export const deleteUserWholesaleCodeAction = atom(null, async (get, set, userWholesaleCode) => {
  if (!userWholesaleCode) {
    message.warning("삭제할 도매 코드 ID가 유효하지 않습니다.");
    return;
  }

  try {
    await axios.delete(`http://localhost:8080/api/wholesale/delete/user-code/${userWholesaleCode}`);
    message.success("유저 도매 코드가 성공적으로 삭제되었습니다.");

    // 삭제 후 목록 갱신
    await set(fetchUserWholesaleCodesAction);
  } catch (error) {
    console.error("🚨 유저 도매 코드 삭제 실패:", error);
    message.error("유저 도매 코드 삭제 중 오류가 발생했습니다.");
  }
});
export const getUserWholesaleCodeIdByCodeAction = atom(null, async (get, set, userWholesaleCode) => {
  if (!userWholesaleCode || userWholesaleCode.trim() === "") {
    message.warning("도매 코드가 비어 있습니다.");
    return null;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/wholesale/user-code-id/by-code`, {
      params: { userWholesaleCode }
    });

    const id = response.data?.userWholesaleCodeId;

    if (id == null) {
      message.warning("도매 코드 ID를 찾을 수 없습니다.");
      return null;
    }

    return id;
  } catch (error) {
    console.error("🚨 도매 코드 ID 조회 실패:", error);

    if (error.response?.status === 404) {
      message.warning("해당 도매 코드를 찾을 수 없습니다.");
    } else {
      message.error("도매 코드 ID 조회 중 오류가 발생했습니다.");
    }

    return null;
  }
});
