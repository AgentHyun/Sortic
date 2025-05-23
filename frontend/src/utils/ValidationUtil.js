// ✅ frontend/src/utils/ValidationUtil.js (named export 방식 리팩토링)

export const validateUserId = (userId) => {
  const pattern = /^[a-zA-Z0-9@._-]{4,20}$/;
  if (!userId || !pattern.test(userId)) {
    throw new Error('아이디는 4~20자, 영어/숫자/@._-만 허용됩니다.');
  }
};

export const validatePassword = (password, userId) => {
  if (!password || password.length < 8) {
    throw new Error('비밀번호는 최소 8자 이상 입력해주세요.');
  }
  if (userId && password.includes(userId.slice(0, 3))) {
    throw new Error('아이디의 연속된 3자 이상을 포함할 수 없습니다.');
  }
  const hasTypes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((r) => r.test(password));
  if (hasTypes.length < 2) {
    throw new Error('비밀번호는 영문 대소문자/숫자/특수문자 중 2가지 이상을 포함해야 합니다.');
  }
};

export const validateStoreName = (storeName) => {
  if (!storeName || storeName.length < 2 || storeName.length > 10) {
    throw new Error('상호명은 2~10자 이내여야 합니다.');
  }
};

export const validateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !pattern.test(email)) {
    throw new Error('유효한 이메일 형식이 아닙니다.');
  }
};

export const validatePhone = (phone) => {
  const pattern = /^01[016789][0-9]{7,8}$/;
  if (!phone || !pattern.test(phone)) {
    throw new Error('전화번호는 숫자만 11자리로 입력해주세요.');
  }
};
