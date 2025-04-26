import React from "react";
// Import Swiper React components
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation"; // Don't forget this
import { Navigation, Autoplay } from "swiper/modules"; // Import Navigation module
import Image from "next/image";
import CarImage from "../../../public/Forza-Horizon-5-Release-Date-How-to-pre-order-Download-Size-Everything-you-must-know.jpg";

function Swipering() {
  return (
    <div className="relative overflow-hidden rounded-lg w-full h-[600px]">
      <SwiperComponent
        className="h-full w-full transition-transform duration-500 ease-in-out"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000, // 3 seconds between slides
          disableOnInteraction: false, // keep auto even after user clicks
        }}
        loop={true}
        speed={800}
        navigation={true}
        modules={[Navigation, Autoplay]}
      >
        <SwiperSlide className="!mx-0 relative w-full h-full flex-shrink-0">
          <Image
            src={CarImage}
            alt="img"
            fill
            className="w-full h-[250px] md:h-[350px] lg:h-[400px] object-cover object-center"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/30 text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Your Title</h2>
            <p className="mb-4 max-w-md">Your description here</p>
            <button className="px-6 py-2 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors">
              Call to Action
            </button>
          </div>
        </SwiperSlide>
        <SwiperSlide className="!mx-0 relative w-full h-full flex-shrink-0">
          <Image
            src={CarImage}
            alt="img"
            fill
            className="w-full h-[250px] md:h-[350px] lg:h-[400px] object-cover object-center"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/30 text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Your Title</h2>
            <p className="mb-4 max-w-md">Your description here</p>
            <button className="px-6 py-2 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors">
              Call to Action 2
            </button>
          </div>
        </SwiperSlide>
        <SwiperSlide className="!mx-0 relative w-full h-full flex-shrink-0">
          <Image
            src={CarImage}
            alt="img"
            fill
            className="w-full h-[250px] md:h-[350px] lg:h-[400px] object-cover object-center"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/30 text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Your Title</h2>
            <p className="mb-4 max-w-md">Your description here</p>
            <button className="px-6 py-2 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors">
              Call to Action 2
            </button>
          </div>
        </SwiperSlide>
        <SwiperSlide className="!mx-0 relative w-full h-full flex-shrink-0">
          <Image
            src={CarImage}
            alt="img"
            fill
            className="w-full h-[250px] md:h-[350px] lg:h-[400px] object-cover object-center"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/30 text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Your Title</h2>
            <p className="mb-4 max-w-md">Your description here</p>
            <button className="px-6 py-2 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors">
              Call to Action 2
            </button>
          </div>
        </SwiperSlide>
        <SwiperSlide className="!mx-0 relative w-full h-full flex-shrink-0">
          <Image
            src={CarImage}
            alt="img"
            fill
            className="w-full h-[250px] md:h-[350px] lg:h-[400px] object-cover object-center"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/30 text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Your Title</h2>
            <p className="mb-4 max-w-md">Your description here</p>
            <button className="px-6 py-2 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors">
              Call to Action 2
            </button>
          </div>
        </SwiperSlide>
      </SwiperComponent>
    </div>
  );
}

export default Swipering;
