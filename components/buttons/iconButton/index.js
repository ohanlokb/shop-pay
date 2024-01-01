import { BiRightArrowAlt } from 'react-icons/bi';
import styles from './styles.module.scss'

export default function IconButton({type,text,icon,radius}) {
    return (
        <button className={styles.button} type={type}>
            {text}
            <div className={styles.svg__wrap}>
                <BiRightArrowAlt />
            </div>
        </button>
    );
}
