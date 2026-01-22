import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './dropdown.module.scss';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/lib/hooks/useAuth';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { useRef } from 'react';

interface Props {
  onClose: () => void;
}

const UserDropdown = ({ onClose }: Props) => {
  const { logout } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside([{contentRef: ref, onClickOutside: onClose}]);

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
