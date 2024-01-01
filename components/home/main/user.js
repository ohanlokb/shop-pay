import { useSession } from "next-auth/react";

import Link from "next/link";
import styles from "./styles.module.scss";

import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BsHeart } from "react-icons/bs";
import { AiOutlineMessage } from "react-icons/ai";
import { useRef, useState } from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

// import required modules
import { EffectCards, Navigation } from "swiper/modules";
import { userSwiperArray } from "@/data/home";

import {signOut, signIn} from 'next-auth/react'

export default function User() {
  const { data: session } = useSession();
  return (
    <div className={styles.user}>
      <img
        src="../../../images/userHeader.jpg"
        alt=""
        className={styles.user__header}
      />
      <div className={styles.user__container}>
        {session ? (
          <div className={styles.user__infos}>
            <img src={session.user?.image} alt="" />
            <h4>{session.user.name}</h4>
          </div>
        ) : (
          <div className={styles.user__infos}>
            <img
              src="../../../images/userDefault.png"
              alt=""
            />
            <div className={styles.user__infos_btns}>
              <button>Register</button>
              <button onClick={() => signIn()} >Login</button>
            </div>
          </div>
        )}
        <ul className={styles.user__links}>
          <li key='li_1'>
            <Link legacyBehavior href="/profile">
              <a>
                <IoSettingsOutline />
              </a>
            </Link>
          </li>
          <li key='li_2'>
            <Link legacyBehavior href="">
              <a>
                <HiOutlineClipboardList />
              </a>
            </Link>
          </li>
          <li key='li_3'>
            <Link legacyBehavior href="">
              <a>
                <AiOutlineMessage />
              </a>
            </Link>
          </li>
          <li key='li_4'>
            <Link legacyBehavior href="">
              <a>
                <BsHeart />
              </a>
            </Link>
          </li>
        </ul>
        <div className={styles.userSwiper}>
          {/* <img
            src="../../../images/uk-flag.png"
            alt=""
            className={styles.new}
          /> */}
          <Swiper
            effect={"cards"}
            loop={true}
            grabCursor={true}
            navigation={true}
            modules={[EffectCards, Navigation]}
            className="userSwiper"
            style={{
              maxWidth: "180px",
              height: "240px",
              marginTop: "1rem",
            }}
          >
            {userSwiperArray.map((item, i) => (
              <SwiperSlide key={i}>
                <Link href="">
                  <img src={item.image} alt="" />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </div>
      <img
        src="../../../images/userHeader.jpg"
        alt=""
        className={styles.user__footer}
      />
    </div>
  );
}
