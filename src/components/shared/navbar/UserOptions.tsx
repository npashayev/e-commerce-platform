'use client';
import styles from './user-options.module.scss';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRef, useState } from 'react';
import UserDropdown from './UserDropdown';
import useClickOutside from '@/lib/hooks/useClickOutside';

const UserOptions = () => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside([{ contentRef: ref, onClickOutside: () => setDropdownOpen(false) }]);

  return (
    <div ref={ref} className={styles.userMenu}>
      <button
        className={styles.userNameCnr}
        onClick={() => setDropdownOpen(prev => !prev)}
      >
        <div className={styles.userName}>
          {user?.firstName + ' ' + user?.lastName}
        </div>
        <FontAwesomeIcon icon={faUser} className={styles.userIcon} />
      </button>

      {dropdownOpen && <UserDropdown onClose={() => setDropdownOpen(false)} />}
    </div>
  );
};

export default UserOptions;
