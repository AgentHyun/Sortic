import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useAtom } from 'jotai';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticatedAtom } from '../../auth/authAtoms';
import { userAtom } from '../../user/userAtoms';
import { useLogin } from '../../auth/authService';
import styles from './css/Login.module.css';
import {fetchCategoryCountAction} from '../SorterPage/actions/categoryAction'
import {selectedUserIdAtom} from "../SorterPage/atoms/atoms";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setUser] = useAtom(userAtom);
  const login = useLogin();

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({ userId: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) {
      const targetPath = location.state?.from?.pathname || '/';
      navigate(targetPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [`${field}Error`]: '' }));
  };

  const onFinish = async () => {
    const { userId, password } = formData;
    if (!userId || !password) {
      setFormErrors({
        userIdError: !userId ? '아이디를 입력해주세요.' : '',
        passwordError: !password ? '비밀번호를 입력해주세요.' : '',
      });
      return;
    }

    const result = await login({ userId, password });
    if (result.success) {
      setUser(result.user);
      message.success(`${result.user.storeName}님 환영합니다!`);
      const targetPath = location.state?.from?.pathname || '/';
      navigate(targetPath, { replace: true });
    } else {
      message.error(result.message || '로그인 실패');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Sortic 로그인</h1>
        <Form form={form} onFinish={onFinish} layout="vertical" className={styles.form}>
          <Form.Item validateStatus={formErrors.userIdError ? 'error' : ''} help={formErrors.userIdError}>
            <Input
              placeholder="아이디"
              value={formData.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              className={styles.input}
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item validateStatus={formErrors.passwordError ? 'error' : ''} help={formErrors.passwordError}>
            <Input.Password
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={styles.input}
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className={styles.button}>
              로그인
            </Button>
          </Form.Item>

          {/* ✅ 하단 버튼 그룹 */}
          <div className={styles.buttonRow}>
            <Link to="/forgot-password" className={styles.subButton}>
              비밀번호 찾기
            </Link>
            <Link to="/signup" className={styles.subButton}>
              회원가입
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
