import styles from "./styles.module.scss";

import { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export default function MainSwiper() {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        //centeredSlides={true}
        loop={true}
        
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
        
        pagination={{
          clickable: true
        }}
        
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mainSwiper"
      >
        {            
            [...Array(11).keys()].map((i) => (
                <SwiperSlide key={i}>
                    <img key={i} src= {`../../../images/swiper/card${i+1}.png` } alt=''/>
                </SwiperSlide>        
            ))
        }
      </Swiper>
    </>
  );
}
