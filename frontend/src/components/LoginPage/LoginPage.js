// src/components/LoginPage/Login.js
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useAtom } from 'jotai';
import { Link, useNavigate } from 'react-router-dom'; // react-router-dom에서 Link 컴포넌트와 페이지 전환을 위한 useNavigate 훅을 임포트합니다.
import { isAuthenticatedAtom, authUserAtom } from '../../auth/authAtoms'; // 인증 관련 전역 상태(isAuthenticatedAtom, authUserAtom)를 가져와 사용자 로그인 상태를 관리합니다.
import { login } from '../../auth/authService'; // 인증 서비스에서 login 함수를 가져와 사용자 로그인 API 호출을 처리합니다.
import styles from './Login.module.css'; // 모듈화된 CSS 파일에서 스타일을 import 하여 컴포넌트 내에서 클래스명 충돌 없이 사용합니다.

const Login = () => { // Login 컴포넌트의 함수형 컴포넌트 정의를 시작합니다.
  const [loading, setLoading] = useState(false); // loading 상태를 관리하기 위해 useState 훅 사용, 초기값은 false이며 API 호출 중 로딩 여부를 나타냅니다.
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom); // Jotai의 useAtom 훅을 사용하여 인증 상태를 업데이트할 수 있는 setter를 가져옵니다.
  const [, setAuthUser] = useAtom(authUserAtom); // 로그인한 사용자 정보를 업데이트하기 위한 setter를 Jotai 상태에서 가져옵니다.
  const navigate = useNavigate(); // 페이지 전환을 위해 useNavigate 훅을 호출하여 navigate 함수를 가져옵니다.
  const [form] = Form.useForm(); // Ant Design Form 컴포넌트를 위한 form 인스턴스를 생성하여 폼 상태와 메서드를 제어합니다.

  const onFinish = async (values) => { // 폼이 성공적으로 제출되었을 때 실행되는 onFinish 함수 정의, 비동기 처리를 위해 async로 선언합니다.
    if (loading) return; // 이미 로딩 중이면 추가 요청을 방지하기 위해 함수를 종료합니다.
    setLoading(true); // API 호출을 시작하기 전에 loading 상태를 true로 변경하여 로딩 중임을 표시합니다.
    try { // 로그인 API 호출을 시도하며 예외 처리를 위해 try-catch 블록을 사용합니다.
      const data = await login(values.user_id, values.password); // 입력된 아이디와 비밀번호를 login 함수에 전달하여 API 호출을 하고, 결과를 data 변수에 저장합니다.
      if (data && data.user) { // 반환된 데이터가 유효하며 user 정보가 포함되어 있으면 로그인 성공 처리를 진행합니다.
        setIsAuthenticated(true); // 전역 상태를 업데이트하여 사용자가 인증되었음을 기록합니다.
        setAuthUser(data.user); // 전역 상태에 로그인한 사용자 정보를 저장합니다.
        message.success(`${data.user.username}님 환영합니다!`); // 로그인 성공 메시지를 사용자에게 보여줍니다.
        navigate('/sorter'); // 로그인 후 사용자를 '/sorter' 경로로 리다이렉트 시킵니다.
      } else { // 로그인 API 호출 결과가 예상과 다르게 user 정보가 없으면,
        message.error('로그인에 실패했습니다.'); // 실패 메시지를 사용자에게 표시합니다.
      }
    } catch (error) { // 로그인 과정에서 에러가 발생할 경우 이를 잡아 처리합니다.
      console.error('Login error:', error); // 에러의 상세 내용을 콘솔에 출력하여 디버깅에 활용합니다.
      if (error.response?.status === 401) { // API 에러 응답 코드가 401(인증 실패)인 경우,
        message.error('아이디 또는 비밀번호가 올바르지 않습니다.'); // 해당 에러 메시지를 사용자에게 보여줍니다.
      } else { // 다른 종류의 서버 에러인 경우,
        message.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'); // 일반 서버 오류 메시지를 사용자에게 전달합니다.
      }
    } finally { // try-catch 블록 이후에 항상 실행되는 finally 블록에서,
      setLoading(false); // 로딩 상태를 false로 변경하여 API 호출이 완료되었음을 나타냅니다.
    }
  };

  return ( // 컴포넌트가 렌더링하는 JSX를 반환하는 부분입니다.
    <div className={styles.container}> {/* 페이지 전체를 감싸는 div로, 스타일은 Login.module.css에서 container 클래스를 적용받습니다. */}
      <div className={styles.loginBox}> {/* 로그인 박스 영역을 나타내는 div, 스타일은 loginBox 클래스를 사용합니다. */}
        <h1 className={styles.title}>Sortic 로그인</h1> {/* 로그인 페이지의 제목을 h1 태그로 표시하며 title 클래스로 스타일링합니다. */}
        <Form
          form={form} // 앞서 생성한 form 인스턴스를 Form 컴포넌트에 연결하여 제어 가능하게 합니다.
          onFinish={onFinish} // 폼 제출 시 실행될 onFinish 핸들러를 지정합니다.
          layout="vertical" // 폼 아이템들이 수직으로 배치되도록 layout 속성을 "vertical"로 설정합니다.
          className={styles.form} // 추가 스타일 적용을 위해 CSS 모듈의 form 클래스를 사용합니다.
        >
          <Form.Item
            name="user_id" // 이 Form.Item은 사용자의 아이디를 입력 받으며, 폼 데이터의 키는 "user_id" 입니다.
            rules={[{ required: true, message: '아이디를 입력해주세요.' }]} // 필수 입력 항목임을 명시하고, 미입력 시 나타날 오류 메시지를 설정합니다.
          >
            <Input
              placeholder="아이디" // 사용자에게 입력 필드의 용도를 알려주기 위해 플레이스홀더를 "아이디"로 지정합니다.
              className={styles.input} // CSS 모듈의 input 클래스를 적용하여 입력창의 스타일을 정의합니다.
              disabled={loading} // 로딩 상태일 경우 입력 필드 비활성화하여 중복 입력을 방지합니다.
              autoComplete="username" // 브라우저 자동완성 기능을 위해 autoComplete 속성을 "username"으로 설정합니다.
            />
          </Form.Item>
          <Form.Item
            name="password" // 이 Form.Item은 사용자의 비밀번호를 입력 받으며, 폼 데이터의 키는 "password" 입니다.
            rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]} // 비밀번호 입력이 필수임을 명시하고 미입력 시 오류 메시지를 지정합니다.
          >
            <Input.Password
              placeholder="비밀번호" // 비밀번호 입력 필드의 용도를 명시하기 위해 플레이스홀더를 "비밀번호"로 설정합니다.
              className={styles.input} // 입력 필드에 대한 스타일 지정은 CSS 모듈의 input 클래스를 통해 적용됩니다.
              disabled={loading} // 로딩 중인 경우 해당 입력 필드를 비활성화하여 사용자로부터의 입력을 막습니다.
              autoComplete="current-password" // 브라우저 자동완성 기능을 위해 autoComplete 속성을 "current-password"로 설정합니다.
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"  // Ant Design의 primary 타입 버튼을 사용하여 강조된 스타일의 버튼을 만듭니다.
              htmlType="submit" // 버튼이 폼 제출을 트리거하도록 htmlType 속성을 "submit"으로 설정합니다.
              className={styles.button}  // CSS 모듈에서 button 클래스를 적용하여 버튼의 스타일을 정의합니다.
              loading={loading} // 버튼 자체에 로딩 스피너를 표시하여 API 호출 중임을 사용자에게 알립니다.
              block  // 버튼이 부모 요소의 전체 너비를 차지하도록 block 속성을 적용합니다.
            >
              {loading ? '로그인 중...' : '로그인'} {/* 로딩 상태에 따라 버튼 텍스트를 '로그인 중...' 또는 '로그인'으로 동적으로 변경합니다. */}
            </Button>
          </Form.Item>
        </Form>
        <p className={styles.linkText}> {/* 회원가입 링크 영역을 p 태그로 감싸며 CSS 모듈의 linkText 클래스를 적용합니다. */}
          아직 계정이 없으신가요?{' '} {/* 안내 문구로, 회원가입에 대한 질문을 표시합니다. */}
          <Link to="/signup" className={styles.link}> {/* 리액트 라우터의 Link 컴포넌트를 사용하여 회원가입 페이지로 이동하는 링크를 제공합니다. */}
            회원가입 {/* 링크 텍스트로 '회원가입'을 표시합니다. */}
          </Link>
        </p>
      </div>
    </div>
  ); // JSX 반환 부분의 종료 (전체 로그인 페이지 레이아웃 구성)
};

export default Login; // Login 컴포넌트를 기본 내보내기로 설정하여 다른 파일에서 쉽게 임포트할 수 있도록 합니다.
