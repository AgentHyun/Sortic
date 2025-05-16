// ✅ SignupPage.js (이메일 인증 연동 포함 리팩토링 완료)
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';
import publicAxios from '../../api/publicAxios';
import authAxios from '../../api/authAxios';
import { sendEmailCode, verifyEmailCode } from '../service/emailService';
import { useAtom } from 'jotai';
import { authLoadingAtom, isAuthenticatedAtom } from '../../auth/authAtoms';

const { Title } = Typography;

function SignupPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [authLoading] = useAtom(authLoadingAtom);

  const [emailSent, setEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isStoreChecked, setIsStoreChecked] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate(-1);
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    let timer;
    if (emailSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [emailSent, countdown]);

  const handleSubmit = async (values) => {
    const { checkpassword, verificationCode, ...signupData } = values;
    if (!isEmailVerified) {
      message.warning('이메일 인증을 완료해주세요.');
      return;
    }
    setIsSubmitting(true);
    try {
      await publicAxios.post('/users/signup', signupData);
      message.success('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (err) {
      message.error(err.response?.data || '서버 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckId = async () => {
    const id = form.getFieldValue('userId');
    if (!id) {
      form.validateFields(['userId']);
      return;
    }
    try {
      const { data } = await publicAxios.get(`/users/check-userid`, { params: { userId: id } });
      if (data) {
        message.success('사용 가능한 아이디입니다.');
        setIsIdChecked(true);
      } else {
        message.error('이미 사용 중인 아이디입니다.');
        setIsIdChecked(false);
      }
    } catch {
      message.error('중복 확인 실패');
      setIsIdChecked(false);
    }
  };

  const handleCheckStore = async () => {
    const store = form.getFieldValue('store_name');
    if (!store) {
      form.validateFields(['store_name']);
      return;
    }
    try {
      const { data } = await publicAxios.get(`/users/check-store`, { params: { storeName: store } });
      if (data) {
        message.success('사용 가능한 상호명입니다.');
        setIsStoreChecked(true);
      } else {
        message.error('이미 사용 중인 상호명입니다.');
        setIsStoreChecked(false);
      }
    } catch {
      message.error('상호명 확인 실패');
      setIsStoreChecked(false);
    }
  };

  const handleSendVerification = async () => {
    const email = form.getFieldValue('email');
    if (!email) {
      form.validateFields(['email']);
      return;
    }
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      message.warning('유효한 이메일을 입력해주세요.');
      return;
    }
    try {
      await sendEmailCode(email);
      setEmailSent(true);
      setShowVerificationInput(true);
      setCountdown(300);
      setIsEmailVerified(false);
      message.success('인증번호를 이메일로 발송했습니다.');
    } catch {
      message.error('인증번호 발송에 실패했습니다.');
    }
  };

  const handleVerifyCode = async () => {
    const email = form.getFieldValue('email');
    const code = form.getFieldValue('verificationCode');
    if (!code) {
      form.validateFields(['verificationCode']);
      return;
    }
    try {
      await verifyEmailCode(email, code);
      setIsEmailVerified(true);
      message.success('이메일 인증이 완료되었습니다.');
    } catch {
      message.error('인증번호가 올바르지 않거나 만료되었습니다.');
      setIsEmailVerified(false);
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
            if ('store_name' in changed) setIsStoreChecked(false);
          }}
        >
          <Form.Item label="아이디" name="userId" rules={[{ required: true, message: '아이디를 입력하세요.' }, { pattern: /^[a-zA-Z0-9@._-]{4,20}$/, message: '아이디는 4~20자, 영어/숫자/@._-만 허용됩니다.' }]}>
            <Input className={styles.inputShort} placeholder="아이디" />
          </Form.Item>
          <Button onClick={handleCheckId} disabled={isIdChecked}>{isIdChecked ? '사용 가능' : '중복확인'}</Button>

          <Form.Item label="비밀번호" name="password" dependencies={['userId']} rules={[{ required: true, message: '비밀번호는 필수입니다.' }, { min: 8, message: '비밀번호는 최소 8자 이상 입력해 주세요.' }, ({ getFieldValue }) => ({ validator(_, value) {
              const userId = getFieldValue('userId');
              if (value && userId && value.includes(userId.slice(0, 3))) {
                return Promise.reject(new Error('아이디의 연속된 3자 이상을 포함할 수 없습니다.'));
              }
              const hasTypes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter(r => r.test(value));
              if (hasTypes.length < 2) {
                return Promise.reject(new Error('영문 대소문자/숫자/특수문자 중 2가지 이상을 조합해야 합니다.'));
              }
              return Promise.resolve();
            }})]}>
            <Input.Password className={styles.input} placeholder="비밀번호" />
          </Form.Item>

          <Form.Item label="비밀번호 확인" name="checkpassword" dependencies={['password']} rules={[{ required: true, message: '비밀번호 확인은 필수입니다.' }, ({ getFieldValue }) => ({ validator(_, value) {
              return value === getFieldValue('password') ? Promise.resolve() : Promise.reject(new Error('입력한 비밀번호와 다릅니다.'));
            }})]}>
            <Input.Password className={styles.input} placeholder="비밀번호 확인" />
          </Form.Item>

          <Form.Item label="상호명" name="store_name" rules={[{ required: true, message: '상호명을 입력하세요.' }, { min: 2, max: 10, message: '상호명은 2~10글자 내로 입력해주세요.' }]}>
            <Input className={styles.input} placeholder="상호명" />
          </Form.Item>
          <Button onClick={handleCheckStore} disabled={isStoreChecked}>{isStoreChecked ? '사용 가능' : '중복확인'}</Button>

          <Form.Item label="이메일" name="email" rules={[{ required: true, message: '이메일을 입력해주세요.' }, { type: 'email', message: '올바른 이메일 형식이 아닙니다.' }]}>
            <Input className={styles.input} placeholder="이메일" />
          </Form.Item>
          <Button onClick={handleSendVerification}>{emailSent ? '재전송' : '인증번호 발송'}</Button>

          {showVerificationInput && (
            <>
              <Form.Item name="verificationCode" label="인증번호 입력" rules={[{ required: true, message: '인증번호를 입력해주세요.' }]}>
                <Input className={styles.inputShort} placeholder="인증번호" />
              </Form.Item>
              <Button onClick={handleVerifyCode} disabled={isEmailVerified}>인증확인</Button>
                <div className={styles.timer}>남은 시간: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')} 내에 입력해주세요</div>
            </>
          )}

          <Form.Item label="전화번호" name="phone" rules={[{ required: true, message: '전화번호는 필수입니다.' }, { pattern: /^\d{11}$/, message: '하이픈 없이 숫자 11자리를 입력해주세요.' }]}>
            <Input className={styles.input} maxLength={11} placeholder="전화번호" />
          </Form.Item>

          <Form.Item name="agree" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('개인정보취급방침에 동의해주세요.')) }]}>
            <Checkbox>개인정보취급방침에 동의합니다 (<a href="/privacy" target="_blank" rel="noopener noreferrer">보기</a>)</Checkbox>
          </Form.Item>

          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? '처리 중...' : '회원가입'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default SignupPage;
