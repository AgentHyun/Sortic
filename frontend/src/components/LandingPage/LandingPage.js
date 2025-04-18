// frontend/src/components/LandingPage/LandingPage.js
import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Carousel from './Carousel';
import styles from './LandingPage.module.css';

const { Title, Text } = Typography;

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Row className={styles.fullHeight} align="middle">
                {/* 소개글 영역 - 40% */}
                <Col xs={24} md={10} className={styles.leftSection}>
                    <div className={styles.textWrapper}>
                        <Title level={1} className={styles.title}>
                            Sortic에 오신 걸 환영합니다!
                        </Title>
                        <Text className={styles.description}>
                            직관적인 Sortic! 지금 경험해보세요!
                        </Text>
                        <div className={styles.buttons}>
                            <Button type="primary" onClick={() => navigate('/login')}>로그인</Button>
                          <Button style={{marginLeft: '1rem'}} onClick={() => navigate('/signup')}>회원가입</Button>
                        </div>
                    </div>
                </Col>

                {/* 캐러셀 영역 - 60% */}
                <Col xs={24} md={14} className={styles.rightSection}>
                    <Carousel />
                </Col>
            </Row>
        </div>
    );
};

export default LandingPage;
