import Link from 'next/link';
import styles from './styles.module.scss'

export default function Links() {
    return (
        <div className={styles.footer__links}>
        {
            links.map( (section, index) => (
                <ul key={index}>
                    {
                        index===0 ? (
                        <img key={index} src='../../../images/dark-logo.png' alt=''/>
                        ) : (
                            <b key={index}>{section.heading}</b>
                        )
                    }
                    {
                        section.links.map( (link, i) => (
                            <li key={i}>
                                <Link key={i} href={link.name}>{link.name}</Link>
                            </li>
                        ) )
                    }
                </ul>
            ))
        }
    </div>

    );
}

const links = [
    {
        heading: 'Shop-Pay',
        links: [
            {
                name:'About us',
                link: ''
            },
            {
                name:'Contact us',
                link: ''
            }
        ]
    },
    {
        heading: 'Help & Support',
        links: [
            {
                name:'Shipping Info',
                link: ''
            },
            {
                name:'Returns',
                link: ''
            },
            {
                name:'How to Order',
                link: ''
            },
            {
                name:'How to Track Your Order',
                link: ''
            },
            {
                name:'Size Guide',
                link: ''
            }
        ]
    },
    {
        heading: 'Customer Support',
        links: [
            {
                name:'Customer Service',
                link: ''
            },
            {
                name:'Terms and Conditions',
                link: ''
            },
            {
                name:'Consumers (Transactions)',
                link: ''
            },
            {
                name:'Provide Your Feedback',
                link: ''
            }
        ]
    }
]