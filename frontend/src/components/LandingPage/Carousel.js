// frontend/src/components/LandingPage/Carousel.js
import React from 'react';
import { Carousel as AntCarousel } from 'antd';

const Carousel = () => (
    <AntCarousel autoplay>
      <div><img src="/carousel1.png" alt="slide1" /></div>
      <div><img src="/carousel2.png" alt="slide2" /></div>
      <div><img src="/carousel3.png" alt="slide3" /></div>
      <div><img src="/carousel4.png" alt="slide4" /></div>
    </AntCarousel>
);

export default Carousel;
