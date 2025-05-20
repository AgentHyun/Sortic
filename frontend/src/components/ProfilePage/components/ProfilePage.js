// ✅ ProfilePage.jsx - 구조 리팩토링 (3차): 기본 정보 폼 완전 교체 방식
import React, { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { Tabs, Avatar, Button, Input, message } from 'antd';
import { CameraOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { authUserAtom } from '../../../auth/authAtoms';
import styles from '../css/ProfilePage.module.css';

const ProfilePage = () => {
  const [user, setUser] = useAtom(authUserAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const fileInputRef = useRef(null);

  useEffect(() => {
    setEditedUser({ ...user, password: '', confirmPassword: '' });
  }, [user, isEditing]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    setEditedUser({ ...user, password: '', confirmPassword: '' });
    setIsEditing(false);
  };

  const handleSave = async () => {
    // 실제 저장 API 연동 필요
    message.success('프로필이 저장되었습니다.');
    setIsEditing(false);
  };

  const handleImageUpload = () => fileInputRef.current?.click();

  const readOnlyField = (label, value) => (
    <div className={styles.infoItem}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value || '-'}</span>
    </div>
  );

  const editableField = (label, key, type = 'text') => (
    <div className={styles.infoItem}>
      <span className={styles.label}>{label}</span>
      <Input
        className={styles.input}
        type={type}
        value={editedUser[key] || ''}
        onChange={(e) => setEditedUser({ ...editedUser, [key]: e.target.value })}
      />
    </div>
  );

  const basicInfoSection = isEditing ? (
    <div className={styles.profileCard}>
      <div className={styles.columns}>
        <div className={styles.avatarBlock}>
          <div className={styles.avatarWrapper} onClick={handleImageUpload}>
            <Avatar size={120} src={editedUser.profileImage} className={styles.avatar} />
            <div className={styles.avatarOverlay}><CameraOutlined /></div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
          </div>
        </div>
        <div className={styles.editInfoBox}>
          {readOnlyField('아이디', editedUser.userId)}
          {editableField('비밀번호', 'password', 'password')}
          {editableField('비밀번호 확인', 'confirmPassword', 'password')}
          {editableField('상호명', 'storeName')}
          {editableField('이메일', 'email')}
          {editableField('연락처', 'phone')}
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <Button icon={<SaveOutlined />} type="primary" onClick={handleSave}>저장</Button>
        <Button onClick={handleCancelEdit}>취소</Button>
      </div>
    </div>
  ) : (
    <div className={styles.profileCard}>
      <div className={styles.columns}>
        <div className={styles.avatarBlock}>
          <Avatar size={120} src={user.profileImage} className={styles.avatar} />
        </div>
        <div className={styles.readOnlyInfoBox}>
          {readOnlyField('아이디', user.userId)}
          {readOnlyField('상호명', user.storeName)}
          {readOnlyField('이메일', user.email)}
          {readOnlyField('연락처', user.phone)}
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <Button type="primary" icon={<EditOutlined />} onClick={handleEditClick}>수정</Button>
      </div>
    </div>
  );

  const addressSection = (
    <div className={styles.profileCard}>
      <div className={styles.infoItem}>
        <span className={styles.label}>배송지</span>
        <span className={styles.value}>{user.address || '주소 정보 없음'}</span>
      </div>
    </div>
  );

  return (
    <div className={styles.profileContainer}>
      <Tabs
        items={[
          { key: 'basic', label: '기본 정보', children: basicInfoSection },
          { key: 'address', label: '배송지', children: addressSection }
        ]}
      />
    </div>
  );
};

export default ProfilePage;
