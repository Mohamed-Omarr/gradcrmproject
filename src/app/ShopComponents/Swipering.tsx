import React from "react";
// Import Swiper React components
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import Image from "next/image";
import CarImage from "../../../public/Forza-Horizon-5-Release-Date-How-to-pre-order-Download-Size-Everything-you-must-know.jpg";
function Swipering() {
  return (
    <div className="w-full h-[300px]">
      <SwiperComponent className="h-full w-full " spaceBetween={50} slidesPerView={1}>
        <SwiperSlide className="!mx-0 relative w-full h-full ">
          <Image
            src={CarImage}
            alt="img"
            fill
            className="object-center max-h-full "
          />
        </SwiperSlide>
      </SwiperComponent>
    </div>
  );
}

export default Swipering;
