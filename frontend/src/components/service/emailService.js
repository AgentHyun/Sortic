// ✅ emailService.js
import publicAxios from '../../axios/publicAxios';

/**
 * 이메일 인증번호 전송 요청
 * @param {string} email 사용자 이메일 주소
 */
export const sendEmailCode = async (email) => {
  const response = await publicAxios.post('/email/send-code', { email });
  return response.data;
};

/**
 * 이메일 인증번호 검증 요청
 * @param {string} email 사용자 이메일 주소
 * @param {string} code 인증번호
 */
export const verifyEmailCode = async (email, code) => {
  const response = await publicAxios.post('/email/verify-code', { email, code });
  return response.data;
};
