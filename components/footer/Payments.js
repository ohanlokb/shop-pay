import styles from './styles.module.scss'

export default function Payments() {
    return (
        <div className={styles.footer_payments}>
            <h3>WE ACCEPT</h3>
            <div className={styles.footer__flexwrap}>
                <img src='../../../images/payment/visa.webp' alt='' />
                <img src='../../../images/payment/mastercard.webp' alt='' />
                <img src='../../../images/payment/paypal.webp' alt='' />
            </div>
        </div>
    );
}
