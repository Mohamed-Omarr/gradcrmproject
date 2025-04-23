import React from "react";
// Import Swiper React components
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";

function Swipering() {
  return (
    <div>
      <SwiperComponent
        spaceBetween={50}
        slidesPerView={1}
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </SwiperComponent>
    </div>
  );
}

export default Swipering;
