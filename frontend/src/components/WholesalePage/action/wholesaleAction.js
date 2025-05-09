import { atom } from 'jotai';
import axios from 'axios';
import { message } from 'antd';
import { authUserAtom } from '../../../auth/authAtoms';
import { wholesaleCodesAtom, wholesaleLinksAtom } from '../atoms/atoms';

// 도매 코드 생성
export const createWholesaleCodeAction = atom(null, async (get, set, newCode) => {
  try {
    await axios.post('http://localhost:8080/api/wholesale/code', newCode);
    message.success("도매 코드가 생성되었습니다.");
  } catch (error) {
    console.error("🚨 도매 코드 생성 실패:", error);
    message.error("도매 코드 생성에 실패했습니다.");
  }
});

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

// 도매 코드 삭제
export const deleteWholesaleCodeAction = atom(null, async (get, set, codeId) => {
  try {
    await axios.delete(`http://localhost:8080/api/wholesale/code/${codeId}`);
    message.success("도매 코드가 삭제되었습니다.");
    // 삭제 후 갱신
    set(fetchWholesaleCodesAction);
  } catch (error) {
    console.error("🚨 도매 코드 삭제 실패:", error);
    message.error("도매 코드 삭제에 실패했습니다.");
  }
});

export const createWholesaleLinkAction = atom(null, async (get, set, wholesaleCode) => {
  if (!wholesaleCode || isNaN(Number(wholesaleCode))) {
    message.warning("유효한 도매 코드 ID를 입력해주세요.");
    return;
  }

  try {
    await axios.post(
      `http://localhost:8080/api/wholesale/link/by-code`,
      null,
      {
        params: { wholesaleCode },
      }
    );

    message.success("도매 코드가 등록되었습니다.");
    set(fetchWholesaleLinksAction); // 리스트 새로고침
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
    console.log("링크스 ↓↓↓");
    console.table(get(wholesaleLinksAtom));

  } catch (error) {
    console.error("🚨 도매 링크 조회 실패:");

  }
});

// 도매 링크 수정
export const updateWholesaleLinkAction = atom(null, async (get, set, linkData) => {
  try {
    await axios.put('http://localhost:8080/api/wholesale/link', linkData);
    message.success("도매 링크가 수정되었습니다.");
    // 수정 후 갱신
    set(fetchWholesaleLinksAction);
  } catch (error) {
    console.error("🚨 도매 링크 수정 실패:", error);
    message.error("도매 링크 수정에 실패했습니다.");
  }
});

// 도매 링크 삭제
export const deleteWholesaleLinkAction = atom(null, async (get, set, linkId) => {
  try {
    await axios.delete(`http://localhost:8080/api/wholesale/link/${linkId}`);
    message.success("도매 링크가 삭제되었습니다.");
    // 삭제 후 갱신
    set(fetchWholesaleLinksAction);
  } catch (error) {
    console.error("🚨 도매 링크 삭제 실패:", error);
    message.error("도매 링크 삭제에 실패했습니다.");
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

      const code = response.data?.wholesaleCode;
      if (code === undefined) {
        throw new Error("wholesaleCode 응답 누락");
      }

      return code;
    } catch (error) {
      console.error("🚨 도매 코드 값 조회 실패:", error);
      message.error("도매 코드 값을 불러오지 못했습니다.");
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
