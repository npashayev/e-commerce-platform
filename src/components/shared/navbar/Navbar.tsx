'use client';
import Link from 'next/link';
import styles from './navbar.module.scss';
import Image from 'next/image';
import { useRef } from 'react';
import logo from '@/assets/logo.png';
import UserMenu from './UserMenu';

const Navbar = () => {
  const menuRef = useRef(null);

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.left}>
        <Image
          className={styles.logo}
          src={logo}
          alt="logo"
          height={35}
          width={35}
        />
        <div className={styles.name}>Bazaar</div>
      </Link>
      <div ref={menuRef} className={styles.right}>
        <div className={styles.rightItemsCnr}>
          <nav className={styles.navigation}>
            <ul className={styles.linksCnr}>
              <li>
                <Link href="/" className={styles.link}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products?category=all" className={styles.link}>
                  Products
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.userActionBtns}>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
