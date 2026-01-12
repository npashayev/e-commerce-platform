'use client';
import Link from 'next/link';
import styles from './navbar.module.scss';
import Image from 'next/image';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useResponsiveSidebar from '@/lib/hooks/useResponsiveSidebar';
import { useRef } from 'react';
import useClickOutside from '@/lib/hooks/useClickOutside';
import useBodyScrollLock from '@/lib/hooks/useBodyScrollLock';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const {
    isMobile: isMenuMobile,
    open: isMenuOpen,
    toggle: toggleMenu,
    closeSidebar: closeMenu,
  } = useResponsiveSidebar('(max-width: 760px)');

  //   const {
  //     open: isLikedProductsOpen,
  //     toggle: toggleLikedProducts,
  //     closeSidebar: closeLikedProducts,
  //   } = useResponsiveSidebar();

  const menuRef = useRef(null);
  //   const menuToggleRef = useRef(null);

  // handle click outside action for both menu and liked products using custom hook
  //   useClickOutside([
  //     {
  //       contentRef: menuRef,
  //       toggleRef: menuToggleRef,
  //       onClickOutside: closeMenu,
  //     },
  //     {
  //       contentRef: likedProductsRef,
  //       toggleRef: likedProductsToggleRef,
  //       onClickOutside: closeLikedProducts,
  //     },
  //   ]);

  //   useBodyScrollLock(isMenuOpen);

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.left}>
        <Image className={styles.logo} src={logo} alt="logo" height={35} width={35} />
        <div className={styles.name}>Online shop</div>
      </Link>

      {/* <button ref={menuToggleRef} className={styles.menuIconCnr}>
        <FontAwesomeIcon icon={faBars} onClick={toggleMenu} className={styles.menuIcon} />
      </button> */}

      <div ref={menuRef} className={`${styles.right} ${isMenuOpen && isMenuMobile ? styles.activeRight : ''}`}>
        <div className={styles.rightItemsCnr}>
          <div className={styles.smallScreenDropdown}>
            {/* <UserDropdown user={user} logout={logout} closeMenu={closeMenu} /> */}
          </div>

          <nav className={styles.navigation}>
            <ul className={styles.linksCnr}>
              <li>
                <Link href="/" onClick={closeMenu} className={styles.link}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" onClick={closeMenu} className={styles.link}>
                  Products
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.userActionBtns}>
            {/* <LikedProductsToggle
              closeMenu={closeMenu}
              isLikedProductsOpen={isLikedProductsOpen}
              toggleLikedProducts={toggleLikedProducts}
              ref={likedProductsToggleRef}
            /> */}

            {/* <UserBasket closeMenu={closeMenu} user={user} /> */}

            {/* <UserMenu
              user={user}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              logout={logout}
              closeMenu={closeMenu}
            /> */}
          </div>
        </div>
      </div>

      {/* <LikedProducts
        isLikedProductsOpen={isLikedProductsOpen}
        closeLikedProducts={closeLikedProducts}
        ref={likedProductsRef}
      /> */}
    </header>
  );
};

export default Navbar;
