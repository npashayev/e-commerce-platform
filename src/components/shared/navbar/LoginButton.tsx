'use client';
import styles from './user-options.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LoginButton = () => {
    const pathname = usePathname();
    return (
        pathname !== '/login' && pathname !== '/register' &&
        <Link href='/login' className={styles.loginBtn}>
            <FontAwesomeIcon icon={faRightToBracket} />
        </Link>
    );
};

export default LoginButton;