import styles from './styles.module.scss'
import Link from 'next/link';
import {signOut, signIn} from 'next-auth/react'

export default function UserMenu({session}) {
    return (
    <div className={styles.menu}>
        <h4>Welcome</h4>
        { session 
        ? 
            <div className={styles.flex}>
                <img src={session.user.image} alt="" className={styles.menu__img}/>
                <div className={styles.col}>
                    <span>Welcome Back,</span>
                    <h3>{session.user.name}</h3>
                    <span onClick={() => signOut()}>Sign out</span>
                </div>
            </div>
        : 
            <div className={styles.flex}>
                <button className={styles.btn_primary}>Register</button>
                <button onClick={() => signIn()} className={styles.btn_outlined}>Login</button>
            </div>
        }
        <ul>
            <li key='li_1'>
                <Link href='/profile'>Account</Link>
            </li>
            <li key='li_2'>
                <Link href='/profile/orders'>My Orders</Link>
            </li>
            <li key='li_3'>
                <Link href='/profile/messages'>Message Center</Link>
            </li>
            <li key='li_4'>
                <Link href='/profile/address'>Address</Link>
            </li>
            <li key='li_5'>
                <Link href='/profile/wishlist'>Wishlist</Link>
            </li>
        </ul>
    </div>
    );
}
