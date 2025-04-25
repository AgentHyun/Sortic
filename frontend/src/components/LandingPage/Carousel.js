// frontend/src/components/LandingPage/Carousel.js
import React from 'react';
import { Carousel as AntCarousel } from 'antd';
import styles from './Carousel.module.css';

const Carousel = () => (
    <AntCarousel autoplay className={styles.carousel}>
        <div className={styles.slideItem}>
            <img src="/carousel1.png" alt="slide1" />
        </div>
        <div className={styles.slideItem}>
            <img src="/carousel2.png" alt="slide2" />
        </div>
        <div className={styles.slideItem}>
            <img src="/carousel3.png" alt="slide3" />
        </div>
        <div className={styles.slideItem}>
            <img src="/carousel4.png" alt="slide4" />
        </div>
    </AntCarousel>
);

export default Carousel;
