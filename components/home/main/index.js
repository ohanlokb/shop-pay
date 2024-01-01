import Link from 'next/link';
import Menu from './menu';
import Offers from './offers';
import styles from './styles.module.scss'
import MainSwiper from './swiper';
import User from './user';
import Header from './header';

export default function Main({country}) {
    return (
        <div className={styles.main}>
            <Header />
            <Menu />
            <MainSwiper />
            <Offers />
            <User />
        </div>
    );
}
