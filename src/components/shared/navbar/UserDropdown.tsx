import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './dropdown.module.scss';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/lib/hooks/useAuth';

interface Props {
  onClose: () => void;
}

const UserDropdown = ({ onClose }: Props) => {
  const { logout } = useAuth();

  return (
    <div className={styles.dropdown} onClick={onClose}>
      <button onClick={logout} className={styles.item}>
        <FontAwesomeIcon icon={faRightFromBracket} />
        Log out
      </button>
    </div>
  );
};

export default UserDropdown;
