import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Button, message, Avatar, Input, Tabs } from 'antd';
import { CameraOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { userAtom } from '../../Atoms/UserAtom';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const [user, setUser] = useAtom(userAtom);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const [isEditingNickname, setIsEditingNickname] = useState(false);
    const fileInputRef = useRef(null);

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user_id = localStorage.getItem('user_id');
                const response = await fetch(`/api/users/profile?user_id=${user_id}`);

                if (!response.ok) {
                    throw new Error('사용자 정보를 가져오는데 실패했습니다.');
                }

                const userData = await response.json();
                setUser(userData);
                setEditedUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                message.error('사용자 정보를 가져오는데 실패했습니다.');
            }
        };

        if (user?.user_id) {
            fetchUserData();
        }
    }, [setUser, user?.user_id]);

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedUser({ ...user });
    };

    const handleSave = async () => {
        try {
            // 비밀번호 확인
            if (editedUser.password && editedUser.password !== editedUser.confirmPassword) {
                message.error('비밀번호가 일치하지 않습니다.');
                return;
            }

            const user_id = localStorage.getItem('user_id');
            const response = await fetch(`/api/users/profile?user_id=${user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedUser),
            });

            if (!response.ok) {
                throw new Error('프로필 업데이트 실패');
            }

            setUser(editedUser);
            setIsEditing(false);
            message.success('프로필이 업데이트되었습니다.');
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error('프로필 업데이트에 실패했습니다.');
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('image', file);
                const user_id = localStorage.getItem('user_id');
                formData.append('user_id', user_id);

                const response = await fetch('/api/users/profile-image', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('이미지 업로드 실패');
                }

                const data = await response.json();
                setEditedUser({ ...editedUser, profileImage: data.imageUrl });
                setUser({ ...user, profileImage: data.imageUrl });
                message.success('프로필 이미지가 업데이트되었습니다.');
            } catch (error) {
                console.error('Error uploading image:', error);
                message.error('이미지 업로드에 실패했습니다.');
            }
        }
    };

    const handleNicknameEdit = () => {
        setIsEditingNickname(true);
    };

    const handleNicknameSubmit = (e) => {
        if (e.key === 'Enter') {
            setUser({ ...user, nickname: editedUser.nickname });
            setIsEditingNickname(false);
        }
    };

    const items = [
        {
            key: 'basic',
            label: '기본 정보',
            children: (
                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatarSection}>
                            <div
                                className={styles.avatarWrapper}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Avatar
                                    size={120}
                                    src={user.profileImage}
                                    className={styles.avatar}
                                />
                                <div className={styles.avatarOverlay}>
                                    <CameraOutlined className={styles.cameraIcon} />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </div>
                            {isEditingNickname ? (
                                <Input
                                    value={editedUser.nickname}
                                    onChange={(e) => setEditedUser({ ...editedUser, nickname: e.target.value })}
                                    onKeyPress={handleNicknameSubmit}
                                    onBlur={() => setIsEditingNickname(false)}
                                    autoFocus
                                />
                            ) : (
                                <div
                                    className={styles.nickname}
                                    onClick={handleNicknameEdit}
                                >
                                    {user.nickname}
                                </div>
                            )}
                        </div>
                        <div className={styles.profileInfo}>
                            <div className={styles.infoList}>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>ID</span>
                                    <span className={styles.value}>{user.user_id}</span>
                                </div>
                                {isEditing && (
                                    <>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>변경할 비밀번호</span>
                                            <Input.Password
                                                className={styles.input}
                                                value={editedUser.password}
                                                onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>비밀번호 확인</span>
                                            <Input.Password
                                                className={styles.input}
                                                value={editedUser.confirmPassword}
                                                onChange={(e) => setEditedUser({ ...editedUser, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>연락처</span>
                                    {isEditing ? (
                                        <Input
                                            className={styles.input}
                                            value={editedUser.phone}
                                            onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                                        />
                                    ) : (
                                        <span className={styles.value}>{user.phone}</span>
                                    )}
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>이메일</span>
                                    {isEditing ? (
                                        <Input
                                            className={styles.input}
                                            value={editedUser.email}
                                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                                        />
                                    ) : (
                                        <span className={styles.value}>{user.email}</span>
                                    )}
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.label}>거주지</span>
                                    {isEditing ? (
                                        <Input
                                            className={styles.input}
                                            value={editedUser.location}
                                            onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                                        />
                                    ) : (
                                        <span className={styles.value}>{user.location}</span>
                                    )}
                                </div>
                            </div>
                            <div className={styles.actionButtons}>
                                {isEditing ? (
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={handleSave}
                                    >
                                        저장
                                    </Button>
                                ) : (
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={handleEditClick}
                                    >
                                        수정
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'activity',
            label: '활동 내역',
            children: (
                <div className={styles.activitySection}>
                    <div className={styles.activityList}>
                        활동 내역이 없습니다.
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className={styles.profileContainer}>
            <Tabs items={items} />
        </div>
    );
};

export default ProfilePage;
