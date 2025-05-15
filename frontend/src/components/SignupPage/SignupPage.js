import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';
import publicAxios from '../../api/publicAxios';
import authAxios from '../../api/authAxios';
import axios from 'axios';
import { useAtom } from 'jotai';
import { authLoadingAtom, isAuthenticatedAtom } from '../../auth/authAtoms';

const { Title } = Typography;
const { Option } = Select;

function SignupPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [authLoading] = useAtom(authLoadingAtom);

  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [address, setAddress] = useState({
    zipcode: '',
    roadAddress: '',
    detailAddress: ''
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(-1);
    }
  }, [authLoading, isAuthenticated, navigate]);

  const searchAddress = async () => {
    if (!keyword.trim()) {
      message.warning('주소 키워드를 입력해주세요.');
      return;
    }
    try {
      const response = await axios.get('https://business.juso.go.kr/addrlink/addrLinkApi.do', {
        params: {
          confmKey: process.env.REACT_APP_JUSO_KEY,
          currentPage: 1,
          countPerPage: 10,
          keyword: keyword,
          resultType: 'json'
        }
      });
      const juso = response.data?.results?.juso;
      if (juso?.length > 0) {
        setSearchResults(juso);
      } else {
        message.info('검색 결과가 없습니다.');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('주소 검색 실패:', err);
      message.error('주소 검색에 실패했습니다.');
    }
  };

  const handleSubmit = async (values) => {
    const { confirm, ...signupData } = values;
    const fullForm = {
      ...signupData,
      zipcode: address.zipcode,
      roadAddress: address.roadAddress,
      detailAddress: address.detailAddress
    };

    setIsSubmitting(true);
    try {
      await authAxios.post('/signup', fullForm, {
        headers: { 'Content-Type': 'application/json' }
      });
      message.success('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (err) {
      if (err.response) {
        const error = err.response.data || '서버 오류가 발생했습니다.';
        message.error(error);
      } else {
        message.error('서버 연결에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckId = async (form) => {
    const id = form.getFieldValue('userId');
    if (!id) return;
    if (id.length < 4 || id.length > 20) {
      message.warning('아이디는 4~20자 사이여야 합니다.');
      return;
    }
    try {
      const response = await publicAxios.get(`/users/check-userid`, { params: { userId: id } });
      const isAvailable = response.data;
      if (!isAvailable) {
        message.error('이미 사용 중인 아이디입니다.');
        form.setFields([{ name: 'userId', errors: ['이미 사용 중인 아이디입니다.'] }]);
      } else {
        message.success('사용 가능한 아이디입니다.');
        form.setFields([{ name: 'userId', errors: [] }]);
      }
    } catch (err) {
      message.error('아이디 중복 확인에 실패했습니다.');
      form.setFields([{ name: 'userId', errors: ['아이디 중복 확인에 실패했습니다.'] }]);
    }
  };

  if (authLoading) return null;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Title level={2} className={styles.title}>회원가입</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="true"
          className={styles.form}
        >
          <Form.Item label="아이디" required>
            <div className={styles.inlineWrap}>
              <Form.Item name="userId" noStyle>
                <Input className={styles.inputShort} placeholder="아이디" />
              </Form.Item>
              <Button className={styles.checkButton} onClick={() => handleCheckId(form)} type="default">
                중복확인
              </Button>
            </div>
          </Form.Item>

          <Form.Item label="비밀번호" name="password" dependencies={['userId']} rules={[{ required: true, message: '비밀번호를 입력해주세요.' }, { min: 6, message: '비밀번호는 6자 이상이어야 합니다.' }, ({ getFieldValue }) => ({ validator(_, value) {
              if (!value || value.length < 6) return Promise.resolve();
              const userId = getFieldValue('userId');
              if (userId && userId.length >= 3) {
                for (let i = 0; i <= userId.length - 3; i++) {
                  const chunk = userId.substring(i, i + 3);
                  if (value.includes(chunk)) {
                    return Promise.reject(new Error('비밀번호에 아이디의 연속된 3자 이상의 문자열을 포함할 수 없습니다.'));
                  }
                }
              }
              return Promise.resolve();
            }})]}>
            <Input.Password className={styles.input} placeholder="비밀번호 (8자 이상)" />
          </Form.Item>

          <Form.Item label="비밀번호 확인" name="checkpassword" dependencies={['password']} rules={[{ required: true, message: '비밀번호 확인을 입력해주세요.' }, ({ getFieldValue }) => ({ validator(_, value) { return value === getFieldValue('password') ? Promise.resolve() : Promise.reject(new Error('비밀번호가 일치하지 않습니다.')); }})]}>
            <Input.Password className={styles.input} placeholder="비밀번호 확인" />
          </Form.Item>

          <Form.Item label="상호명" name="store_name" rules={[{ required: true, message: '상호명을 입력해주세요.' }]}> <Input className={styles.input} placeholder="상호명" /> </Form.Item>

          <Form.Item label="이메일" name="email" rules={[{ required: true, message: '이메일을 입력해주세요.' }, { type: 'email', message: '올바른 이메일 형식이 아닙니다.' }]}> <Input className={styles.input} placeholder="이메일" autoComplete="new-email" /> </Form.Item>

          <Form.Item label="전화번호" name="phone" rules={[{ required: true, message: '전화번호를 입력해주세요.' }]}> <Input className={styles.input} placeholder="'-' 하이픈 없이 번호만 입력해 주세요" maxLength={11} autoComplete="new-phone" /> </Form.Item>

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
