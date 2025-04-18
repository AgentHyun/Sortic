import React from 'react';
import { Form, Input, Button, Typography, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';

const { Title } = Typography;
const { Option } = Select;

function SignupPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('회원가입 정보:', values);
    // TODO: 백엔드 연동
    navigate('/login');
  };

  const handleCheckId = async (form) => {
    const id = form.getFieldValue('username');
    if (!id) return;

    try {
      // 실제 서버 요청으로 바꿔야 함
      const isDuplicate = await fakeCheckIdAPI(id); // 임시 함수
      if (isDuplicate) {
        message.error('이미 사용 중인 아이디입니다.');
      } else {
        message.success('사용 가능한 아이디입니다.');
      }
    } catch (err) {
      message.error('서버 오류가 발생했습니다.');
    }
  };

// 임시 mock API
  const fakeCheckIdAPI = async (id) => {
    const used = ['admin', 'test', 'user123'];
    await new Promise((r) => setTimeout(r, 500));
    return used.includes(id);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Title level={2} className={styles.title}>회원가입</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="true"
          className={styles.form}
        >
          <Form.Item label="아이디" required>
            {/* ✅ inline 정렬용 wrapper */}
            <div className={styles.inlineWrap}>
              <Form.Item
                name="username"
                noStyle /* ✅ 레이아웃 겹침 방지 */
                rules={[{
                  required: true,
                  validator: (_, value) => {
                    if (!value || value.length < 4) return Promise.reject("아이디는 최소 4글자 이상입니다.");
                    if (/[^a-zA-Z0-9_.]/.test(value)) return Promise.reject("한글/특수문자 불가 (_ . 제외)");
                    if (/^[0-9]+$/.test(value)) return Promise.reject("숫자로만 된 아이디는 불가합니다.");
                    return Promise.resolve();
                  }
                }]}
              >
                <Input className={styles.inputShort} allowClear placeholder="아이디" />
              </Form.Item>
              <Button className={styles.checkButton} onClick={() => handleCheckId(form)} type="default">
                중복확인
              </Button>
            </div>
          </Form.Item>

          <Form.Item label="비밀번호" name="password" rules={[{ required: true, validator: (_, value) => {
              const id = form.getFieldValue('username');
              if (!value || value.length < 6) return Promise.reject("비밀번호는 최소 6자 이상입니다.");
              if (value === id) return Promise.reject("아이디와 동일한 비밀번호는 사용할 수 없습니다.");
              for (let i = 0; i <= id.length - 3; i++) {
                if (value.includes(id.slice(i, i + 3))) return Promise.reject("비밀번호에 아이디 일부가 포함되었습니다.");
              }
              return Promise.resolve();
            } }]}>
            <Input.Password className={styles.input} allowClear placeholder="비밀번호" />
          </Form.Item>

          <Form.Item label="비밀번호 확인" name="confirm" dependencies={['password']} rules={[
            { required: true, message: '비밀번호 확인을 입력하세요.' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve();
                return Promise.reject(new Error('비밀번호가 일치 하지 않습니다.'));
              }
            })
          ]}>
            <Input.Password className={styles.input} allowClear placeholder="비밀번호 확인" />
          </Form.Item>

          <Form.Item label="닉네임" name="nickname" rules={[{ required: true, message: '닉네임을 입력하세요.' }]}>
            <Input className={styles.input} allowClear placeholder="닉네임" />
          </Form.Item>

          <Form.Item label="휴대폰 번호" name="phone" rules={[{ required: true, message: '휴대폰 번호를 입력하세요.' }]}>
            <Input className={styles.input} allowClear maxLength={11} placeholder="01022224444" />
          </Form.Item>

          <Form.Item label="이메일" name="email" rules={[{ required: true, type: 'email', message: '이메일을 입력하세요.' }]}>
            <Input className={styles.input} allowClear placeholder="example@example.com" />
          </Form.Item>

          <Form.Item label="거주지역" name="region" rules={[{ required: true, message: '거주지역을 선택하세요.' }]}>
            <Select className={styles.select} placeholder="거주지역 선택">
              <Option value="서울">서울</Option>
              <Option value="경기">경기</Option>
              <Option value="부산">부산</Option>
              <Option value="대전">대전</Option>
              <Option value="광주">광주</Option>
              <Option value="기타">기타</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button className={styles.button} type="primary" htmlType="submit" block>
              회원가입
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default SignupPage;
