import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Input, Tabs, message, Spin } from 'antd';
import { CameraOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import styles from '../css/ProfilePage.module.css';
import authAxios from '../../../axios/authAxios';
import {
  validateUserId,
  validatePassword,
  validateStoreName,
  validateEmail,
  validatePhone,
} from '../../../utils/ValidationUtil';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({});
  const [errors, setErrors] = useState({});
  const [storeNameChecked, setStoreNameChecked] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authAxios.get('/profile');
        setProfile(res.data);
        setEdited({ ...res.data, password: '', confirmPassword: '' });
      } catch (err) {
        message.error('프로필 정보를 불러오지 못했습니다.');
      }
    };
    fetchProfile();
  }, []);

  const validateAll = () => {
    const newErrors = {};
    try {
      if (edited.password) validatePassword(edited.password, edited.userId);
    } catch (e) {
      newErrors.password = e.message;
    }
    if (edited.password !== edited.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    try {
      validateStoreName(edited.storeName);
    } catch (e) {
      newErrors.storeName = e.message;
    }
    try {
      validateEmail(edited.email);
    } catch (e) {
      newErrors.email = e.message;
    }
    try {
      validatePhone(edited.phone);
    } catch (e) {
      newErrors.phone = e.message;
    }
    if (!storeNameChecked) {
      newErrors.storeName = '상호명 중복 확인이 필요합니다.';
    }
    if (!emailVerified) {
      newErrors.email = '이메일 인증이 필요합니다.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateAll()) return;
    try {
      await authAxios.put('/profile/save', edited);
      message.success('프로필이 저장되었습니다.');
      setIsEditing(false);
      setProfile({ ...profile, ...edited });
    } catch (err) {
      message.error('저장에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setEdited({ ...profile, password: '', confirmPassword: '' });
    setErrors({});
    setIsEditing(false);
  };

  const handleImageUpload = () => fileInputRef.current?.click();

  const handleStoreNameCheck = async () => {
    try {
      const res = await authAxios.post('/users/check-store', { storeName: edited.storeName });
      if (res.data.available) {
        message.success('사용 가능한 상호명입니다.');
        setStoreNameChecked(true);
      } else {
        message.error('이미 사용 중인 상호명입니다.');
        setStoreNameChecked(false);
      }
    } catch (err) {
      message.error('상호명 중복 확인에 실패했습니다.');
    }
  };

  const handleSendEmailCode = async () => {
    try {
      await authAxios.post('/email/send-code', { email: edited.email });
      message.success('인증번호가 발송되었습니다.');
      setEmailCodeSent(true);
    } catch (err) {
      message.error('인증번호 발송에 실패했습니다.');
    }
  };

  const handleVerifyEmailCode = async () => {
    try {
      const res = await authAxios.post('/email/verify-code', {
        email: edited.email,
        code: emailCodeInput,
      });
      if (res.data.verified) {
        message.success('이메일이 인증되었습니다.');
        setEmailVerified(true);
      } else {
        message.error('인증번호가 일치하지 않습니다.');
        setEmailVerified(false);
      }
    } catch (err) {
      message.error('이메일 인증에 실패했습니다.');
    }
  };

  const readOnlyField = (label, value) => (
    <div className={styles.infoItem}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value || '-'}</span>
    </div>
  );

  const editableField = (label, key, type = 'text', extra = null) => (
    <div className={styles.infoItem}>
      <span className={styles.label}>{label}</span>
      <Input
        className={styles.input}
        type={type}
        value={edited[key] || ''}
        onChange={(e) => setEdited({ ...edited, [key]: e.target.value })}
        placeholder={key === 'phone' ? "'-' 없이 숫자만 입력 (예: 01012345678)" : ''}
      />
      {extra}
      {errors[key] && <div className={styles.error}>{errors[key]}</div>}
    </div>
  );

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  const basicSection = isEditing ? (
    <div className={styles.profileCard}>
      <div className={styles.columns}>
        <div className={styles.avatarBlock}>
          <div className={styles.avatarWrapper} onClick={handleImageUpload}>
            <Avatar size={120} src={edited.profileImage} className={styles.avatar} />
            <div className={styles.avatarOverlay}>
              <CameraOutlined />
            </div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
          </div>
        </div>
        <div className={styles.editInfoBox}>
          {readOnlyField('아이디', edited.userId)}
          {editableField('비밀번호', 'password', 'password')}
          {editableField('비밀번호 확인', 'confirmPassword', 'password')}
          {editableField(
            '상호명',
            'storeName',
            'text',
            <Button onClick={handleStoreNameCheck} style={{ marginLeft: '8px' }}>
              중복 확인
            </Button>
          )}
          {editableField(
            '이메일',
            'email',
            'email',
            <>
              <Button onClick={handleSendEmailCode} style={{ marginLeft: '8px' }}>
                인증번호 발송
              </Button>
              {emailCodeSent && (
                <>
                  <Input
                    style={{ marginTop: '8px' }}
                    placeholder="인증번호 입력"
                    value={emailCodeInput}
                    onChange={(e) => setEmailCodeInput(e.target.value)}
                  />
                  <Button onClick={handleVerifyEmailCode} style={{ marginTop: '8px' }}>
                    인증 확인
                  </Button>
                </>
              )}
            </>
          )}
          {editableField('연락처', 'phone')}
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          저장
        </Button>
        <Button onClick={handleCancel}>취소</Button>
      </div>
    </div>
  ) : (
    <div className={styles.profileCard}>
      <div className={styles.columns}>
        <div className={styles.avatarBlock}>
          <Avatar size={120} src={profile.profileImage} className={styles.avatar} />
        </div>
        <div className={styles.readOnlyInfoBox}>
          {readOnlyField('아이디', profile.userId)}
          {readOnlyField('상호명', profile.storeName)}
          {readOnlyField('이메일', profile.email)}
          {readOnlyField('연락처', profile.phone)}
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
          수정
        </Button>
      </div>
    </div>
  );

  const addressSection = (
    <div className={styles.profileCard}>
      <div className={styles.infoItem}>
        <span className={styles.label}>배송지</span>
        <span className={styles.value}>{profile.address || '주소 정보 없음'}</span>
      </div>
    </div>
  );

  return (
    <div className={styles.profileContainer}>
      <Tabs
        items={[
          { key: 'basic', label: '기본 정보', children: basicSection },
          { key: 'address', label: '배송지', children: addressSection },
        ]}
      />
    </div>
  );
};

export default ProfilePage;
