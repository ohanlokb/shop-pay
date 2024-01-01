import Link from 'next/link';
import styles from './styles.module.scss'
import { IoLocationSharp } from 'react-icons/io5';

export default function Copyright({country}) {
    return (
        <div className={styles.footer__copyright}>
            <section>© 2023 Shop Pay, all rights reserved.</section>
            <section>
                <ul key='copywrite'>
                    {
                        data.map( (link,i) => (
                            <li key={i}>
                                <Link key={i} href={link.link}>{link.name}</Link>
                            </li>                            
                        ))
                    }
                    <li key='li_1'>
                        <a key='li_1'>
                            <IoLocationSharp key='li_1' /> {country.name}
                        </a>
                    </li>
                </ul>
            </section>
        </div>        
    );
}

const data = [
    {
        name: 'Privacy Center',
        link: ''
    },
    {
        name: 'Privacy & Cookie Policy',
        link: ''
    },
    {
        name: 'Manage Cookies',
        link: ''
    },
    {
        name: 'Terms & Conditions',
        link: ''
    },
    {
        name: 'Copyright Notice',
        link: ''
    }

]
