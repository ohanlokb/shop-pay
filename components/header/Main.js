import styles from './styles.module.scss'
import Link from 'next/link';
import { RiSearch2Line } from "react-icons/ri";
import { FaOpencart } from "react-icons/fa";
import { useSelector } from 'react-redux';

export default function Main() {
    //const {checkout} = useSelector((state) => ({...state}));
    const checkout = useSelector( state => state.checkout );
   
    return <div className={styles.main}>
        <div className={styles.main__container}>
            <Link href='/'>
                <div className={styles.logo}>
                    <img
                        src='../../../images/dark-logo.png'
                        alt=''/>
                </div>
            </Link>
            <div className={styles.search}>
                <input type='text' placeholder='Search...'/>
                <div className={styles.search__icon}>
                    <RiSearch2Line/>
                </div>
            </div>
            <div>
                <Link href='/cart'>
                    <div className={styles.cart}>
                        <FaOpencart/>
                        <span>{checkout.checkoutItems.length}</span>
                    </div>
                </Link>
            </div>
        </div>
    </div>;
}