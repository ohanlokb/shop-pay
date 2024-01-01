import styles from './styles.module.scss'
import { MdSecurity } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { BiHelpCircle } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { RiCustomerServiceLine, RiArrowDropDownFill } from "react-icons/ri";
import Link from 'next/link';
import { useState } from "react";
import UserMenu from './UserMenu';

import { useSession } from "next-auth/react"

export default function Top({country}) {
    const { data: session } = useSession();
    const [visible,setVisible] = useState(false);
    
    return <div className={styles.top}>
        <div className={styles.top__container}>
            <div></div>
            <ul className={styles.top__list}>
                <li key='li_1' className={styles.li}>
                    <img 
                        src={country.flag} 
                        alt=""/>
                    <span>{country.name}</span>
                </li>
                <li key='li_2' className={styles.li}>
                    <MdSecurity />
                    <span>Buyer Protection</span>
                </li>
                <li key='li_3' className={styles.li}>
                    <RiCustomerServiceLine />
                    <span>Customer Service</span>
                </li>
                <li key='li_4' className={styles.li}>
                    <BiHelpCircle />
                    <span>Help</span>
                </li>
                <li key='li_5' className={styles.li}>
                    <CiHeart />
                    <Link href='/profile/wishlist'>
                        <span>Wishlist</span>
                    </Link>
                    
                </li>
                <li  key='li_6' className={styles.li}
                    onMouseOver={()=>setVisible(true)}
                    onMouseLeave={()=>setVisible(false)}
                    >
                    { session ? (
                    <li  key='li_6_1' className={styles.li}>
                        <div className={styles.flex}>
                        <img src={session.user.image} alt=""/>
                            <span>{session.user.name}</span>
                            <RiArrowDropDownFill />
                        </div>
                    </li>
                    ) : (
                    <li key='li_6_2' className={styles.li}>
                        <div className={styles.flex}>
                            <VscAccount />
                            <span>Login</span>
                            <RiArrowDropDownFill />
                        </div>
                    </li>
                    )}
                    {
                        visible && <UserMenu session={session} />
                    }                    
                </li>
            </ul>
        </div>
    </div>;
}
