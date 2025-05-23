// ✅ src/components/Policy/PrivacyPolicyModal.jsx - 리팩토링 완료
import React from 'react';
import { Modal, Typography } from 'antd';

const { Paragraph, Title } = Typography;

const PrivacyPolicyModal = ({ open, onClose }) => {
  return (
    <Modal
      title={<Title level={4}>개인정보 수집 및 이용 동의</Title>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      <Typography style={{ fontSize: '14px', whiteSpace: 'pre-line' }}>
        <Paragraph>
          (주)솔틱은 회원가입 및 서비스 제공을 위해 아래와 같이 개인정보를 수집ㆍ이용합니다.
        </Paragraph>

        <Paragraph strong>1. 수집 항목</Paragraph>
        <Paragraph>
          - 필수항목: 아이디, 비밀번호, 상호명, 이메일, 전화번호
          {'\n'}- 자동수집항목: IP주소, 브라우저 정보, 서비스 이용기록 등
        </Paragraph>

        <Paragraph strong>2. 수집 목적</Paragraph>
        <Paragraph>
          - 회원 식별 및 본인 확인
          {'\n'}- 회원가입 절차 및 이메일 인증 처리
          {'\n'}- 고객지원 및 서비스 이용 관련 공지 전달
        </Paragraph>

        <Paragraph strong>3. 보유 및 이용기간</Paragraph>
        <Paragraph>
          - 회원 탈퇴 시 또는 관련 법령에 따른 보관 기간까지 보유
          {'\n'}  (예: 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 거래기록 5년 보관 등)
        </Paragraph>

        <Paragraph strong>4. 제3자 제공 및 위탁</Paragraph>
        <Paragraph>
          - 당사는 원칙적으로 수집한 개인정보를 외부에 제공하지 않습니다.
          {'\n'}- 단, 이메일 인증, 본인확인 등의 업무는 신뢰할 수 있는 전문업체에 위탁하여 처리할 수 있으며,
          {'\n'}  필요한 경우 위탁 사실은 별도로 고지합니다.
        </Paragraph>

        <Paragraph strong>5. 동의 거부 권리 및 불이익 고지</Paragraph>
        <Paragraph>
          - 이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 수 있습니다.
          {'\n'}- 단, 동의를 거부할 경우 회원가입 및 서비스 이용이 제한될 수 있습니다.
        </Paragraph>
      </Typography>
    </Modal>
  );
};

export default PrivacyPolicyModal;
