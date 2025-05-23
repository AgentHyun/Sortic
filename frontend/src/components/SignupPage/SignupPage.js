// ✅ SignupPage.js - ValidationUtil 완전 적용 및 인증 상태 리셋/잠금 리팩토링 완료
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { authLoadingAtom, isAuthenticatedAtom } from '../../auth/authAtoms';
import { sendEmailCode, verifyEmailCode } from '../service/emailService';
import publicAxios from '../../api/publicAxios';
import {
  validateUserId,
  validatePassword,
  validatePhone,
  validateEmail,
  validateStoreName
} from '../../utils/ValidationUtil';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import styles from './SignupPage.module.css';

const { Title } = Typography;

const SignupPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authLoading] = useAtom(authLoadingAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  const [emailSent, setEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [countdown, setCountdown] = useState(300);

  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isStoreChecked, setIsStoreChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate(-1);
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    let timer;
    if (emailSent && countdown > 0 && !isEmailVerified) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [emailSent, countdown, isEmailVerified]);

  const allChecksPassed = isIdChecked && isStoreChecked && isEmailVerified;

  const handleSubmit = async (values) => {
    const { checkpassword, verificationCode, ...signupData } = values;
    if (!isEmailVerified) return message.warning('이메일 인증을 완료해주세요.');
    setIsSubmitting(true);
    try {
      await publicAxios.post('/users/signup', signupData);
      message.success('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.message || err?.message || '서버 오류 발생');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckId = async () => {
    const id = form.getFieldValue('userId');
    try {
      validateUserId(id);
      const { data } = await publicAxios.get(`/users/check-userid`, { params: { userId: id } });
      setIsIdChecked(data);
      data
        ? message.success('사용 가능한 아이디입니다.')
        : message.error('이미 사용 중인 아이디입니다.');
    } catch (err) {
      setIsIdChecked(false);
      message.error(err.message || '아이디 검증 실패');
    }
  };

  const handleCheckStore = async () => {
    const store = form.getFieldValue('storeName');
    try {
      validateStoreName(store);
      const { data } = await publicAxios.get(`/users/check-store`, { params: { storeName: store } });
      setIsStoreChecked(data);
      data
        ? message.success('사용 가능한 상호명입니다.')
        : message.error('이미 사용 중인 상호명입니다.');
    } catch (err) {
      setIsStoreChecked(false);
      message.error(err.message || '상호명 검증 실패');
    }
  };

  const handleSendVerification = async () => {
    const email = form.getFieldValue('email');
    try {
      validateEmail(email);
      await sendEmailCode(email);
      setEmailSent(true);
      setShowVerificationInput(true);
      setCountdown(300);
      setIsEmailVerified(false);
      message.success('인증번호가 이메일로 전송되었습니다.');
    } catch (err) {
      message.error(err.message || '이메일 전송 실패');
    }
  };

  const handleVerifyCode = async () => {
    const email = form.getFieldValue('email');
    const code = form.getFieldValue('verificationCode');
    if (!code) return form.validateFields(['verificationCode']);
    try {
      await verifyEmailCode(email, code);
      setIsEmailVerified(true);
      message.success('이메일 인증이 완료되었습니다.');
    } catch {
      setIsEmailVerified(false);
      message.error('인증번호가 올바르지 않거나 만료되었습니다.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Title level={2} className={styles.title}>회원가입</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
          onValuesChange={(changed) => {
            if ('userId' in changed) setIsIdChecked(false);
            if ('storeName' in changed) setIsStoreChecked(false);
            if ('email' in changed) {
              setIsEmailVerified(false);
              setEmailSent(false);
              setShowVerificationInput(false);
            }
          }}
        >
          <Form.Item label="아이디" name="userId" rules={[{ required: true, validator: (_, value) => {
              try { validateUserId(value); return Promise.resolve(); } catch (e) { return Promise.reject(e.message); }
            }}]}>
            <Input className={styles.inputShort} placeholder="아이디" />
          </Form.Item>
          <Button onClick={handleCheckId} disabled={isIdChecked}>{isIdChecked ? '사용 가능' : '중복확인'}</Button>

          <Form.Item label="비밀번호" name="password" dependencies={['userId']} rules={[{ required: true, validator: (_, value) => {
              try {
                validatePassword(value, form.getFieldValue('userId'));
                return Promise.resolve();
              } catch (e) { return Promise.reject(e.message); }
            }}]}>
            <Input.Password className={styles.input} placeholder="비밀번호" />
          </Form.Item>

          <Form.Item label="비밀번호 확인" name="checkpassword" dependencies={['password']} rules={[{ required: true, validator: (_, value) => {
              return value === form.getFieldValue('password')
                ? Promise.resolve()
                : Promise.reject('입력한 비밀번호와 다릅니다.');
            }}]}>
            <Input.Password className={styles.input} placeholder="비밀번호 확인" />
          </Form.Item>

          <Form.Item label="상호명" name="storeName" rules={[{ required: true, validator: (_, value) => {
              try { validateStoreName(value); return Promise.resolve(); } catch (e) { return Promise.reject(e.message); }
            }}]}>
            <Input className={styles.input} placeholder="상호명" />
          </Form.Item>
          <Button onClick={handleCheckStore} disabled={isStoreChecked}>{isStoreChecked ? '사용 가능' : '중복확인'}</Button>

          <Form.Item label="이메일" name="email" rules={[{ required: true, validator: (_, value) => {
              try { validateEmail(value); return Promise.resolve(); } catch (e) { return Promise.reject(e.message); }
            }}]}>
            <Input className={styles.input} placeholder="이메일" />
          </Form.Item>
          <Button onClick={handleSendVerification}>{emailSent ? '재전송' : '인증번호 발송'}</Button>

          {showVerificationInput && (
            <>
              <Form.Item
                name="verificationCode"
                label="인증번호 입력"
                rules={[{ required: true, message: '인증번호를 입력해주세요.' }]}
              >
                <Input
                  className={styles.inputShort}
                  placeholder="인증번호"
                  disabled={isEmailVerified}
                />
              </Form.Item>
              <Button onClick={handleVerifyCode} disabled={isEmailVerified}>인증확인</Button>
              {!isEmailVerified && (
                <div className={styles.timer}>남은 시간: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}</div>
              )}
            </>
          )}

          <Form.Item label="전화번호" name="phone" rules={[{ required: true, validator: (_, value) => {
              try { validatePhone(value); return Promise.resolve(); } catch (e) { return Promise.reject(e.message); }
            }}]}>
            <Input className={styles.input} maxLength={11} placeholder="전화번호" />
          </Form.Item>

          <Form.Item
            name="agree"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error('개인정보취급방침에 동의해주세요.')),
              },
            ]}
            validateTrigger="onSubmit"
          >
            <Checkbox>
              개인정보취급방침에 동의합니다 (
              <a
                href="#"
                onClick={(e) => {
                  e.stopPropagation(); // ✅ 체크박스로 이벤트 전달 방지
                  e.preventDefault(); // ✅ href로 인한 페이지 이동 방지
                  setIsModalVisible(true); // ✅ 모달만 띄우기
                }}
              >
                보기
              </a>
              )
            </Checkbox>
          </Form.Item>
          <PrivacyPolicyModal open={isModalVisible} onClose={() => setIsModalVisible(false)} />

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting || !allChecksPassed}>
              {isSubmitting ? '처리 중...' : '회원가입'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
