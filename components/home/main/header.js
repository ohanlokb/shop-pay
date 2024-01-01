import Link from "next/link";
import styles from "./styles.module.scss";

export default function Header() {
  return (
    <div className={styles.header}>
        <ul>
            <li>
                <Link href='/'>Men's Cloths</Link>
            </li>
            <li>
                <Link href='/'>Womens's Cloths</Link>
            </li>
            <li>
                <Link href='/'>Kid's Cloths</Link>
            </li>
        </ul>
    </div>

  );
}
