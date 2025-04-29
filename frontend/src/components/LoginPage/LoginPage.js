import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useAtom } from 'jotai';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticatedAtom, authUserAtom, loginFormAtom, loginErrorAtom } from '../../Auth/AuthAtoms';
import { authService } from '../../Auth/AuthService'; // 소문자, 상대경로로 수정
import styles from './css/Login.module.css';

const Login = () => {
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setAuthUser] = useAtom(authUserAtom);
  const [formData, setFormData] = useAtom(loginFormAtom);
  const [formErrors, setFormErrors] = useAtom(loginErrorAtom);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [`${field}Error`]: '' }));
  };

  const onFinish = async () => {
    try {
      const { userId, password } = formData;

      if (!userId) {
        setFormErrors((prev) => ({ ...prev, userIdError: '아이디를 입력해주세요.' }));
        return;
      }
      if (!password) {
        setFormErrors((prev) => ({ ...prev, passwordError: '비밀번호를 입력해주세요.' }));
        return;
      }

      const data = await authService.login(userId, password); // 수정: authService.login 호출
      if (data && data.user) {
        setIsAuthenticated(true);
        setAuthUser(data.user);
        message.success(`${data.user.username}님 환영합니다!`);
        navigate('/sorter');
      } else {
        message.error('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || '서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Sortic 로그인</h1>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className={styles.form}
        >
          <Form.Item
            validateStatus={formErrors.userIdError ? 'error' : ''}
            help={formErrors.userIdError}
          >
            <Input
              placeholder="아이디"
              value={formData.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              className={styles.input}
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            validateStatus={formErrors.passwordError ? 'error' : ''}
            help={formErrors.passwordError}
          >
            <Input.Password
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={styles.input}
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.button}
              block
            >
              로그인
            </Button>
          </Form.Item>
        </Form>
        <p className={styles.linkText}>
          아직 계정이 없으신가요?{' '}
          <Link to="/signup" className={styles.link}>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
