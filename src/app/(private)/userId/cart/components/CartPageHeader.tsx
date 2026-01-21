'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './cart-page.module.scss';

interface CartPageHeaderProps {
  goCheckout: () => void;
}

export default function CartPageHeader({ goCheckout }: CartPageHeaderProps) {
  return (
    <div className={styles.pageHeading}>
      <div className={styles.backBtnCnr}>
        <Link href="/products">
          <FontAwesomeIcon icon={faChevronLeft} className={styles.backIcon} /> Continue Shopping
        </Link>
      </div>
      <div className={styles.headingText}>
        Shopping cart
        <button className={styles.goBtn} onClick={goCheckout}>
          Go to checkout
        </button>
      </div>
    </div>
  );
}
