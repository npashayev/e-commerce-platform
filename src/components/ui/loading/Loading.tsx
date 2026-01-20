import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from './loading.module.scss';
import { CSSProperties } from 'react';

interface Props {
    style?: CSSProperties;
    text?: string;
}

const Loading = ({ style, text }: Props) => {
    return (
        <div style={style} className={styles.loadingCnr}>
            <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
            {text && <p className={styles.text}>{text}</p>}
        </div>
    );
};

export default Loading;