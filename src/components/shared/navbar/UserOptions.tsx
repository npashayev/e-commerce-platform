'use client';
import styles from './user-options.module.scss';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '@/lib/hooks/useAuth';
import { useState } from 'react';
import UserDropdown from './UserDropdown';

const UserOptions = () => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className={styles.userMenu}>
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
