// src/components/OrderPage/OrderPage.js

import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../OrderPage/css/OrderPage.css";

const OrderPage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // 카드 3개씩 보여주기
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "40px",
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  const cards = Array.from({ length: 6 }, (_, i) => i + 1); // 카드 6개 샘플

  return (

    <div className="order-bill-slider-container">
      <div className="order-info">
        <h2 className="order-title">마우스를 올려 <span className="gold"> 영수증</span>을 조회해요</h2>

      </div>

      <Slider {...settings}>
        {cards.map((card, index) => (
          <div key={index} className="order-bill-container">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <p className="order-title">FLIP CARD {card}</p>
                  <p>Hover Me</p>
                </div>
                <div className="flip-card-back">
                  <p className="order-title">BACK {card}</p>
                  <p>Leave Me</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default OrderPage;
