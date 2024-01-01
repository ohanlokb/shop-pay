import styles from "./styles.module.scss";

import { offersAarray } from "@/data/home";
import { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import Link from "next/link";

export default function Offers() {
  return (
    <div className={styles.offers} >
      <Swiper
        slidesPerView={3}
        spaceBetween={10}

        loop={true}
        
        pagination={{
          clickable: true
        }}

        navigation={true}
        
        modules={[Pagination, Navigation]}
        className="offersSwiper"
      >
        {
            offersAarray.map( (offer, i) => (
                <SwiperSlide key={i}>
                    <Link href=''>
                        <img key={i} src= { offer.image } alt=''/>
                    </Link>
                    <span>${offer.price}</span>
                    <span>-{offer.discount}%</span>
                    
                </SwiperSlide>
            ))
        }
      </Swiper>
    </div>
  )
}
