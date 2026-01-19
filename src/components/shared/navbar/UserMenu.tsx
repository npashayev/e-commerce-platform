import styles from './user-options.module.scss';
import UserOptions from "./UserOptions";
import LoginButton from './LoginButton';
import { useAuth } from '@/lib/hooks/useAuth';

const UserMenu = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className={styles.main}>
            {
                isAuthenticated
                    ? <UserOptions />
                    : <LoginButton />
            }
        </div>
    );
};

export default UserMenu;