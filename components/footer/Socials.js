import { FaFacebookF, FaTiktok } from 'react-icons/fa';
import { BsInstagram, BsSnapchat, BsTwitter, BsYoutube } from 'react-icons/bs';

import styles from './styles.module.scss'

export default function Socials() {
    return (
        <div className={styles.footer__socials}>
            <section>
                <h3>STAY CONNECTED</h3>
                <ul>
                    <li key='fb'>
                        <a href='/' target='_blank'>
                            <FaFacebookF />
                        </a>
                    </li>
                    <li key='ig'>
                        <a href='/' target='_blank'>
                            <BsInstagram />
                        </a>
                    </li>
                    <li key='tw'>
                        <a href='/' target='_blank'>
                            <BsTwitter />
                        </a>
                    </li>
                    <li key='yt'>
                        <a href='/' target='_blank'>
                            <BsYoutube />
                        </a>
                    </li>
                    <li key='sn'>
                        <a href='/' target='_blank'>
                            <BsSnapchat />
                        </a>
                    </li>
                    <li key='tt'>
                        <a href='/' target='_blank'>
                            <FaTiktok />
                        </a>
                    </li>
                </ul>
            </section>        
        </div>
        );
}
