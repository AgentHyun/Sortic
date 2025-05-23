// ✅ ProfilePage.jsx - 전화번호 실시간 유효성 검사 및 입력 제한 반영
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Input, Tabs, message, Spin } from 'antd';
import { CameraOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import styles from '../css/ProfilePage.module.css';
import authAxios from '../../../axios/authAxios';
import { validatePassword, validateEmail, validatePhone } from '../../../utils/ValidationUtil';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({});
  const [errors, setErrors] = useState({});
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const [countdown, setCountdown] = useState(0);
  const fileInputRef = useRef(null);

  const resetEmailVerificationState = () => {
    setEmailVerified(false);
    setEmailCodeSent(false);
    setEmailCodeInput('');
    setCountdown(0);
  };

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

  useEffect(() => {
    let timer;
    if (emailCodeSent && countdown > 0 && !emailVerified) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [emailCodeSent, countdown, emailVerified]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (key, value) => {
    const updated = { ...edited, [key]: value };
    setEdited(updated);

    if (key === 'email') resetEmailVerificationState();

    let newErrors = { ...errors };
    try {
      if (key === 'password') {
        validatePassword(value, edited.userId);
        delete newErrors.password;
        if (updated.confirmPassword && updated.confirmPassword !== value) {
          newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        } else {
          delete newErrors.confirmPassword;
        }
      }
      if (key === 'confirmPassword') {
        if (value !== updated.password) {
          newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        } else {
          delete newErrors.confirmPassword;
        }
      }
      if (key === 'phone') {
        validatePhone(value);
        delete newErrors.phone;
      }
    } catch (e) {
      newErrors[key] = e.message;
    }

    setErrors(newErrors);
  };

  const validateAll = () => {
    const newErrors = {};

    if (edited.password || edited.confirmPassword) {
      try {
        if (edited.password) validatePassword(edited.password, edited.userId);
      } catch (e) {
        newErrors.password = e.message;
      }
      if (edited.password !== edited.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }
    }

    if (edited.email !== profile.email) {
      try {
        validateEmail(edited.email);
      } catch (e) {
        newErrors.email = e.message;
      }
      if (!emailVerified) {
        newErrors.email = '이메일 인증이 필요합니다.';
      }
    }

    try {
      validatePhone(edited.phone);
    } catch (e) {
      newErrors.phone = e.message;
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
    resetEmailVerificationState();
    setIsEditing(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await authAxios.post('/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // ✅ 직접 추가
        },
      });

      const imageUrl = res.data.imageUrl;
      setEdited((prev) => ({ ...prev, profileImage: imageUrl }));
      message.success('프로필 이미지가 업로드되었습니다.');
    } catch (err) {
      console.error(err);
      message.error('이미지 업로드에 실패했습니다.');
    }
  };


  const handleSendEmailCode = async () => {
    try {
      validateEmail(edited.email);
      await authAxios.post('/email/send-code', { email: edited.email });
      message.success('인증번호가 발송되었습니다.');
      setEmailCodeSent(true);
      setEmailVerified(false);
      setCountdown(300);
    } catch (err) {
      message.error('인증번호 발송에 실패했습니다.');
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!edited.email || !emailCodeInput) {
      return message.error('이메일과 인증번호를 모두 입력해주세요.');
    }

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
      }
    } catch (err) {
      console.error(err);
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
      <div className={styles.inputGroup}>
        <Input
          className={styles.input}
          type={type}
          value={edited[key] || ''}
          onChange={(e) => {
            const raw = e.target.value;
            const value = key === 'phone' ? raw.replace(/[^0-9]/g, '') : raw;
            handleInputChange(key, value);
          }}
          maxLength={key === 'phone' ? 11 : undefined}
          placeholder={key === 'phone' ? "'-' 없이 숫자만 입력 (예: 01012345678)" : ''}
        />
        {errors[key] && <div className={styles.error}>{errors[key]}</div>}
        {extra && <div className={styles.extra}>{extra}</div>}
      </div>
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
          <div className={styles.avatarWrapper} onClick={handleImageClick}>
            <Avatar size={120} src={edited.profileImage} className={styles.avatar} />
            <div className={styles.avatarOverlay}>
              <CameraOutlined />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className={styles.editInfoBox}>
          {readOnlyField('아이디', edited.userId)}
          {readOnlyField('상호명', edited.storeName)}
          {editableField('비밀번호', 'password', 'password')}
          {editableField('비밀번호 확인', 'confirmPassword', 'password')}
          {editableField(
            '이메일',
            'email',
            'email',
            <>
              <Button onClick={handleSendEmailCode} style={{ marginTop: '8px' }} disabled={emailVerified}>
                {emailCodeSent ? '재전송' : '인증번호 발송'}
              </Button>
              {emailCodeSent && (
                <>
                  <Input
                    style={{ marginTop: '8px' }}
                    placeholder="인증번호 입력"
                    value={emailCodeInput}
                    onChange={(e) => setEmailCodeInput(e.target.value)}
                    disabled={emailVerified}
                  />
                  <Button
                    onClick={handleVerifyEmailCode}
                    style={{ marginTop: '8px' }}
                    disabled={emailVerified}
                  >
                    인증 확인
                  </Button>
                  {!emailVerified && (
                    <div className={styles.timer}>
                      남은 시간: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                    </div>
                  )}
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
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => {
            setIsEditing(true);
            resetEmailVerificationState();
            setEdited({ ...profile, password: '', confirmPassword: '' });
          }}
        >
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
