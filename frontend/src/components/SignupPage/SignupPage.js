import React, { useState } from 'react';
import { Form, Input, Button, Typography, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';

const { Title } = Typography;
const { Option } = Select;

// 회원가입 페이지 컴포넌트 정의
function SignupPage() {
  // 폼 인스턴스를 생성하여 필드 값 컨트롤
  const [form] = Form.useForm();

  // 페이지 이동에 사용되는 훅
  const navigate = useNavigate();

  // 회원가입 처리 중 여부를 나타내는 상태값
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 회원가입 완료 시 호출되는 핸들러
  const onFinish = async (values) => {
    setIsSubmitting(true); // 중복 제출 방지를 위해 버튼 비활성화

    try {
      // 서버에 회원가입 요청 전송
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST', // HTTP POST 요청
        headers: {
          'Content-Type': 'application/json', // JSON 형식의 본문 전송
        },
        body: JSON.stringify(values), // 폼 데이터 객체를 JSON 문자열로 변환
      });

      if (response.ok) {
        // 성공 시 메시지 출력 및 로그인 페이지로 이동
        message.success('회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        // 실패 시 서버에서 전달한 에러 메시지 출력
        const error = await response.text();
        message.error(error);
      }
    } catch (err) {
      // 서버 연결 자체에 실패한 경우
      message.error('서버 오류가 발생했습니다.');
    } finally {
      // 요청 종료 후 버튼 다시 활성화
      setIsSubmitting(false);
    }
  };

  // 아이디 중복 확인 버튼 클릭 시 실행되는 함수
  const handleCheckId = async (form) => {
    const id = form.getFieldValue('user_id'); // 입력한 아이디 가져오기
    if (!id) return; // 아이디 입력이 없으면 리턴

    try {
      // 서버에 중복확인 요청
      const response = await fetch(`http://localhost:8080/api/auth/check-userid/${id}`);
      const isAvailable = await response.json(); // 결과를 JSON으로 파싱

      if (!isAvailable) {
        message.error('이미 사용 중인 아이디입니다.'); // 중복된 경우
      } else {
        message.success('사용 가능한 아이디입니다.'); // 사용 가능
      }
    } catch (err) {
      message.error('서버 오류가 발생했습니다.'); // 네트워크 오류
    }
  };

  // 실제 렌더링 반환
  return (
    <div className={styles.page}>
      {/* 전체 페이지를 감싸는 최상위 컨테이너로, 중앙 정렬 및 배경 스타일 지정 */}

      <div className={styles.card}>
        {/* 가운데 정렬된 카드 형태의 박스. 폼과 타이틀 등을 감쌈 */}

        <Title level={2} className={styles.title}>
          {/* 페이지 제목 표시 – h2 태그에 해당하며, 스타일 적용 */}
          회원가입
        </Title>

        <Form
          form={form} // 위에서 생성한 폼 인스턴스를 이 Form에 연결
          layout="vertical" // 라벨과 인풋이 세로 정렬로 배치됨
          onFinish={onFinish} // 제출 시 실행될 콜백 함수 연결
          requiredMark="true" // 필수 입력 항목 표시
          className={styles.form} // 커스텀 CSS 클래스 지정
        >
          {/* 아이디 입력 필드 */}
          <Form.Item label="아이디" required>
            {/* 인풋과 버튼을 한 줄에 배치하는 래퍼 */}
            <div className={styles.inlineWrap}>
              <Form.Item
                name="user_id"
                noStyle // 바깥 Form.Item의 레이아웃만 적용
                rules={[ /* 아이디 유효성 검사 규칙 정의 */ ]}
              >
                <Input className={styles.inputShort} allowClear placeholder="아이디" />
                {/* 아이디 입력창: allowClear는 x 버튼으로 내용 제거 가능 */}
              </Form.Item>

              <Button
                className={styles.checkButton}
                onClick={() => handleCheckId(form)}
                type="default"
              >
                {/* 아이디 중복확인 버튼 */}
                중복확인
              </Button>
            </div>
          </Form.Item>

          {/* 비밀번호 입력 필드 */}
          <Form.Item
            label="비밀번호"
            name="password"
            dependencies={['user_id']}
            rules={[
              { required: true, message: '비밀번호를 입력해주세요.' },
              { min: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value.length < 8) {
                    return Promise.resolve();
                }

                  // 아이디 포함 여부 검사
                  const userId = getFieldValue('user_id');
                  if (userId && userId.length >= 3) {
                    for (let i = 0; i <= userId.length - 3; i++) {
                      const chunk = userId.substring(i, i + 3);
                      if (value.includes(chunk)) {
                        return Promise.reject(new Error('비밀번호에 아이디의 연속된 3자 이상의 문자열을 포함할 수 없습니다.'));
                    }
                  }
                }
                  
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password 
              className={styles.input} 
              allowClear 
              placeholder="비밀번호 (8자 이상)"
            />
          </Form.Item>

          {/* 비밀번호 확인 필드 */}
          <Form.Item 
            label="비밀번호 확인" 
            name="confirm" 
            dependencies={['password']} 
            rules={[
              { required: true, message: '비밀번호 확인을 입력해주세요.' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
                },
              }),
            ]}
          >
            <Input.Password 
              className={styles.input} 
              allowClear 
              placeholder="비밀번호 확인" 
            />
          </Form.Item>

          {/* 닉네임 입력 필드 */}
          <Form.Item
            label="닉네임"
            name="username"
            rules={[{ required: true, message: '닉네임을 입력해주세요.' }]}
          >
            <Input
              className={styles.input}
              allowClear
              placeholder="닉네임"
            />
          </Form.Item>

          {/* 전화번호 입력 필드 */}
          <Form.Item
            label="전화번호"
            name="phone"
            rules={[{ required: true, message: '전화번호를 입력해주세요.' }]}
          >
            <Input
              className={styles.input}
              allowClear
              placeholder="전화번호"
              maxLength={11} // 숫자만 입력 시 11자리 제한
            />
          </Form.Item>

          {/* 이메일 입력 필드 */}
          <Form.Item
            label="이메일"
            name="email"
            rules={[
            { required: true, message: '이메일을 입력해주세요.' },
            { type: 'email', message: '올바른 이메일 형식이 아닙니다.' }
            ]}
          >
            <Input
              className={styles.input}
              allowClear
              placeholder="이메일"
            />
          </Form.Item>

          {/* 거주지역 선택 필드 */}
          <Form.Item
            label="거주지역"
            name="region"
            rules={[{ required: true, message: '거주지역을 선택해주세요.' }]}
          >
            <Select placeholder="거주지역 선택">
              <Option value="서울">서울</Option>
              <Option value="경기">경기</Option>
              <Option value="부산">부산</Option>
              <Option value="대전">대전</Option>
              <Option value="광주">광주</Option>
              <Option value="기타">기타</Option>
              {/* Select 안에 있는 Option들은 실제 선택지 목록 */}
            </Select>
          </Form.Item>

          {/* 하단 제출 버튼 컨테이너 */}
          <div className={styles.buttonContainer}>
            <button
              type="submit" // HTML 기본 submit 동작
              className={styles.submitButton}
              disabled={isSubmitting} // 중복 제출 방지
            >
              {isSubmitting ? '처리 중...' : '회원가입'} {/* 처리 중 상태 텍스트 전환 */}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

// 이 컴포넌트를 외부에서 사용할 수 있도록 export
export default SignupPage;
