import styles from './styles.module.scss';
import DotLoader from 'react-spinners/DotLoader';

export default function DotLoaderSpinner({loading}) {
    console.log('DotLoaderSpinner')
  return (
    <div className={styles.loader}>
        <DotLoader color='lightblue' loading={loading}/>
    </div>
  );
}