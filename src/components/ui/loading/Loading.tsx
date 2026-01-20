import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from './loading.module.scss';
import { CSSProperties } from 'react';

interface Props {
  style?: CSSProperties;
}

const Loading = ({ style }: Props) => {
    return <div style={style} className={styles.loadingCnr}>
        <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
    </div>;
};

export default Loading;