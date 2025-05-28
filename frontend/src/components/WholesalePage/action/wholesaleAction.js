import { atom } from 'jotai';
import authAxios from '../../../axios/authAxios';
import { message } from 'antd';
import { authUserAtom } from '../../../auth/authAtoms';
import { wholesaleCodesAtom, wholesaleLinksAtom} from '../atoms/atoms';
import {
  cardsAtom,
  currentCategoryAtom,
  currentUserIdAtom,
  selectedUserIdAtom,
  wholesalerIdAtom,
  isClonedAtom, selectedLinkAtom
} from "../../SorterPage/atoms/atoms";
import {fetchElementsByCategoryAction} from "../../SorterPage/actions/elementAction";
import {useNavigate} from "react-router-dom";
// 도매 코드 생성


// 도매 코드 조회
export const fetchWholesaleCodesAction = atom(null, async (get, set) => {
  const userId = get(authUserAtom)?.userId;
  try {
    const response = await authAxios.get(`/wholesale/codes/${userId}`);
    set(wholesaleCodesAtom, response.data);
  } catch (error) {
    console.error("🚨 도매 코드 조회 실패:", error);
    message.error("도매 코드 조회에 실패했습니다.");
  }
});

export const createWholesaleCodeAction = atom(
  null,
  async (get, set, wholesaleCode) => {
    const userId = get(authUserAtom)?.userId;

    try {
      const payload = {
        wholesaleCode,
        userId,
      };

      await authAxios.post('/wholesale/code', payload);
      message.success(`도매 코드가 생성되었습니다: ${wholesaleCode}`);

    } catch (error) {
      console.error('🚨 도매 코드 생성 실패:', error);
    }
  }
);


export const deleteWholesaleLinkAction = atom(null, async (get, set, wholesaleLinkId) => {
  if (!wholesaleLinkId) {
    message.warning("삭제할 링크 ID가 유효하지 않습니다.");
    return;
  }

  try {
    console.log("삭제 아이디" + wholesaleLinkId);
    await authAxios.delete(`/wholesale/link/${wholesaleLinkId}`);
    message.success("도매 링크가 삭제되었습니다.");
    await set(fetchWholesaleLinksAction, null); // 리스트 새로고침
  } catch (error) {
    console.error("🚨 도매 링크 삭제 실패:", error);
    message.error("도매 링크 삭제에 실패했습니다.");
  }
});

export const getWholesaleLinkCountByUserAction = atom(
  null,
  async (get, set, userId) => {
    if (!userId) {
      message.warning("사용자 ID가 누락되었습니다.");
      return 0;
    }

    try {
      const res = await authAxios.get(`/wholesale/link/count`, {
        params: { userId },
      });

      const count = res.data;
      console.log("✅ 해당 유저의 도매 링크 개수:", count);
      return count;
    } catch (error) {
      console.error("🚨 유저 도매 링크 개수 조회 실패:", error);
      message.error("도매 링크 개수 조회에 실패했습니다.");
      return 0;
    }
  }
);



export const createWholesaleLinkAction = atom(null, async (get, set, { wholesaleCode }) => {
  try {

    const authUser = get(authUserAtom);
    const userId = authUser?.userId;
    await authAxios.post(
      `/wholesale/link/by-code`,
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
    const response = await authAxios.get(`/wholesale/links/${userId}`);
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
    const response = await authAxios.get(`/wholesale/wholesale-user-code`, {
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
      const response = await authAxios.get(
        `/wholesale/code/${wholesaleCodeId}`
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
    const res = await authAxios.get(`/wholesale/code/search`, {
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
    const response = await authAxios.get(`/wholesale/username/${userId}`);
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
    await authAxios.put(`/wholesale/link/memo`, {
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
    const res = await authAxios.get(`/wholesale/link/memo/${wholesaleLinkId}`);
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
    await authAxios.post(`/wholesale/user-code`, {
      userWholesaleCode: wholesaleCodeId,
      userId : userId,
    });
    message.success("도매 코드가 유저에게 등록되었습니다.");
  } catch (err) {
    console.error("🚨 등록 실패:", err);
    console.log("❗ err.response:", err.response);
    const errorMsg =
      err.response?.data?.message || // JSON 형태일 경우
      err.response?.data ||          // 문자열일 경우
      "등록 중 오류가 발생했습니다.";

    message.error(errorMsg);

  }
});
export const getUserIdByLinkNameAction = atom(null, async (get, set, wholesaleName) => {
  if (!wholesaleName || wholesaleName.trim() === "") {
    message.error("도매 링크 이름이 비어 있습니다.");
    return null;
  }

  try {
    const response = await authAxios.get(`/wholesale/user-id/by-link-name`, {
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


      const res = await authAxios.get(
        '/wholesale/user-id-by-code-id',
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
    const response = await authAxios.get(`/wholesale/user-id/by-username`, {
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
    await authAxios.delete(`/wholesale/delete/user-code/${userWholesaleCode}`);
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
    const response = await authAxios.get(`/wholesale/user-code-id/by-code`, {
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

    }

    return null;
  }
});
export const generateWholesalerCodeAction = atom(null, async (get, set) => {
  const userId = get(authUserAtom)?.userId;

  if (!userId) {
    message.warning("로그인 정보가 없습니다.");
    return null;
  }

  try {
    const response = await authAxios.post(
      `/wholesale/generate-code`,
      null,
      { params: { userId } }
    );

    const { wholesalerCode, status } = response.data;

    if (!wholesalerCode) {
      message.warning("도매 코드 생성 응답이 올바르지 않습니다.");
      return null;
    }

    if (status === "CREATED") {
         set(isClonedAtom,true);
    } else if (status === "EXISTING") {

    } else {
      message.info(`도매 코드: ${wholesalerCode}`);
    }

    return wholesalerCode;
  } catch (error) {
    console.error("🚨 도매 코드 생성 실패:", error);
    if (error.response?.status === 400) {
      message.error(error.response.data.message || "잘못된 요청입니다.");
    } else {
      message.error("도매 코드 생성 중 오류가 발생했습니다.");
    }
    return null;
  }
});

export const cloneUserWithWholesalerCodeAction = atom(null, async (get, set, wholesalerCode) => {
  const fullUserId = get(authUserAtom)?.userId;
  if (!fullUserId) {
    message.warning("로그인 정보가 없습니다.");
    return null;
  }

  const originalUserId = fullUserId.split('_')[0];

  // ✅ 이미 복제된 유저라면 중단
  if (fullUserId !== originalUserId) {
    message.warning("복제된 유저는 다시 복제할 수 없습니다.");
    return null;
  }

  if (!wholesalerCode) {
    message.warning("도매 코드가 비어 있습니다.");
    return null;
  }

  try {
    const checkRes = await authAxios.get(`/wholesale/is-cloned`, {
      params: { userId: originalUserId }
    });

    if (checkRes.data?.isCloned) {

      return null;
    }
  } catch (checkError) {
    console.error("🚨 isCloned 상태 확인 실패:", checkError);
    message.error("유저 상태 확인 중 오류가 발생했습니다.");
    return null;
  }

  try {
    const res = await authAxios.post(`/wholesale/clone-user-with-code`, null, {
      params: {
        userId: originalUserId,
        wholesalerCode
      }
    });

    const newUserId = res.data?.newUserId;
    set(wholesalerIdAtom, newUserId);
    set(currentUserIdAtom, newUserId);
    set(isClonedAtom, true);
    if (newUserId) {
      return newUserId;
    } else {
      message.warning("응답이 올바르지 않습니다.");
      return null;
    }

  } catch (err) {
    console.error("🚨 유저 복제 실패:", err);

    return null;
  }
});


export const fetchWholesalerCodeByUserIdAction = atom(
  null,
  async (get, set, userId) => {
    if (!userId) {
      message.warning("유저 ID가 필요합니다.");
      return null;
    }

    try {
      const response = await authAxios.get(
        '/wholesale/wholesaler-code',
        { params: { userId } }
      );

      const code = response.data?.wholesalerCode;
      if (code) {
        message.success(`도매 코드: ${code}`);
        return code;
      } else {
        message.warning("도매 코드를 찾을 수 없습니다.");
        return null;
      }
    } catch (error) {
      console.error("🚨 도매 코드 조회 실패:", error);
      message.error(
        error.response?.data?.message || "도매 코드 조회 중 오류가 발생했습니다."
      );
      return null;
    }
  }
);
export const fetchClonedUserIdAction = atom(
  null,
  async (get, set, originalUserId) => {
    try {
      const res = await authAxios.get('/wholesale/cloned', {
        params: { userId: originalUserId },
      });

      const clonedUserId = res.data?.userId; // ✅ 이제 정확하게 동작해야 함
      console.log("⬅️ 요청한 userId:", originalUserId);
      console.log("➡️ 서버 응답:", res.data);


      if (clonedUserId) {
        set(selectedUserIdAtom, clonedUserId); // ✅ 상태 반영

        return clonedUserId;
      } else {
        message.info("복제된 유저가 없습니다.");
        return null;
      }

    } catch (error) {
      console.error("🚨 복제 유저 조회 실패:", error);

      return null;
    }
  }
);
export const updateWholesaleCodeByUserIdAction = atom(
  null,
  async (get, set, { userId, userWholesaleCode }) => {
    if (!userId || !userWholesaleCode) {
      message.warning("수정할 도매 코드가 비어 있거나 로그인 정보가 없습니다.");
      return;
    }

    try {
      await authAxios.put("/wholesale/user-code", {
        userId,
        userWholesaleCode,
      });

      message.success("도매 코드가 성공적으로 수정되었습니다.");
      await set(fetchUserWholesaleCodesAction);
    } catch (error) {
      console.error("🚨 도매 코드 수정 실패:", error);
      message.error("도매 코드 수정 중 오류가 발생했습니다.");
    }
  }
);

// action
export const getWholesaleCodesByUserIdAction = atom(
  null,
  async (get, set, userId) => {
    if (!userId) {
      console.warn("⛔ userId 파라미터가 없습니다.");
      return [];
    }

    try {
      const response = await authAxios.get(`/wholesale/wholesale-code/by-user-id`, {
        params: { userId },
      });
      console.log("✅ 도매 코드 조회 결과:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ 도매 코드 조회 실패:", error);
      return [];
    }
  }
);




export const getUserIdsByUserWholesaleCodeAction = atom(
  null,
  async (get, set, userWholesaleCode) => {
    if (!userWholesaleCode) {
      return [];
    }

    try {
      const response = await authAxios.get("/wholesale/user-ids/by-user-code", {
        params: { userWholesaleCode }
      });

      const userIds = response.data;
      console.log("📋 유저 ID 목록:", userIds);
      return userIds;
    } catch (error) {
      console.error("🚨 유저 ID 조회 실패:", error);
      message.error("유저 ID 조회 중 오류가 발생했습니다.");
      return [];
    }
  }
);
export const getUserIdsByOwnerUserIdAction = atom(
  null,
  async (get, set, ownerUserId) => {
    if (!ownerUserId || ownerUserId.trim() === "") {
      message.warning("ownerUserId가 비어 있습니다.");
      return [];
    }

    try {
      const response = await authAxios.get("/wholesale/user-ids/by-owner-id", {
        params: { ownerUserId }
      });

      const userIds = response.data;
      console.log("📋 소유 유저 기준 유저 ID 목록:", userIds);
      return userIds;
    } catch (error) {
      console.error("🚨 ownerUserId로 유저 목록 조회 실패:", error);
      message.error("유저 ID 목록 조회에 실패했습니다.");
      return [];
    }
  }
);


export const getUserProfileByUserIdAction = atom(
  null,
  async (get, set, userId) => {
    if (!userId || userId.trim() === '') {
      message.warning("유저 ID가 비어 있습니다.");
      return null;
    }

    try {
      const response = await authAxios.get('/users/profile', {
        params: { userId }
      });

      const user = response.data;

      // ✅ 이 구조에서 원하는 속성들을 추출해 사용할 수 있음
      console.log("📄 유저 정보:", user);

      return {
        phone: user.phone,
        email: user.email,
        region: user.region,
        username: user.username,
        profileImage: user.profile_image,
        grade: user.grade
      };
    } catch (error) {
      console.error("🚨 사용자 프로필 조회 실패:", error);
      message.error("사용자 정보를 불러오는 데 실패했습니다.");
      return null;
    }
  }
);

export const getUserWholesaleCodeByUserIdAction = atom(null, async (get, set) => {
  const userId = get(selectedUserIdAtom);
  if (!userId) {
    message.warning("userId를 입력해주세요.");
    return null;
  }

  try {
    const response = await authAxios.get('/wholesale/first-user-code/by-user-id', {
      params: { userId }
    });

    const userWholesaleCode = response.data.userWholesaleCode;
    set(selectedLinkAtom, userWholesaleCode);
    console.log("유저 링크 " + userWholesaleCode);
    return userWholesaleCode;
  } catch (error) {
    if (error.response?.status === 404) {
      message.info("해당 유저의 도매 코드가 없습니다.");
    } else {
      console.error("🚨 도매 코드 조회 실패:", error);
      message.error("도매 코드 조회 중 오류가 발생했습니다.");
    }
    return null;
  }
});
