import Links from './Links';
import Socials from './Socials';
import NewsLetter from './NewsLetter'
import styles from './styles.module.scss'
import Payments from './Payments';
import Copyright from './Copyright';

export default function Footer({country}) {
    return <footer className={styles.footer}>
        <div className={styles.footer__container}>
            <Links />
            <Socials />
            <NewsLetter />
            <Payments />
            <Copyright country={country} />
        </div>
    </footer>;
}
