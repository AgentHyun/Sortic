// frontend/src/components/LandingPage/LandingPage.js
import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Carousel from './Carousel';
import styles from './LandingPage.module.css';
import { useAtom } from 'jotai';
import { isAuthenticatedAtom, authLoadingAtom } from '../../auth/authAtoms';

const { Title, Text } = Typography;

const LandingPage = () => {
    const navigate = useNavigate();
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);
    const [authLoading] = useAtom(authLoadingAtom);
    if (authLoading) return null;

    return (
        <div className={styles.container}>
            <Row className={styles.fullHeight} align="middle">
                {/* 소개글 영역 - 58% */}
                <Col xs={24} md={14} className={styles.leftSection}>
                    <div className={styles.textWrapper}>
                        <Title level={1} className={styles.title}>
                            Sortic에 오신 걸 환영합니다!
                        </Title>
                        <Text className={styles.description}>
                            직관적인 Sortic! 지금 경험해보세요!
                        </Text>
                        {/* 로그인 안 된 경우에만 버튼 노출 */}
                        {!isAuthenticated && (
                            <div className={styles.buttons}>
                                <Button type="primary" onClick={() => navigate('/login')}>로그인</Button>
                                <Button style={{marginLeft: '1rem'}} onClick={() => navigate('/signup')}>회원가입</Button>
                            </div>
                        )}
                    </div>
                </Col>

                {/* 캐러셀 영역 - 42% */}
                <Col xs={24} md={10} className={styles.rightSection}>
                    <Carousel />
                </Col>
            </Row>
        </div>
    );
};

export default LandingPage;
