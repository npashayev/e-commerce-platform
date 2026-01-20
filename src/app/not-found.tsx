import Link from 'next/link';
import styles from '@/styles/special-pages.module.scss';

const NotFound = () => {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.errorCode}>404</div>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.description}>
        This page doesn&apos;t exist or was removed.
      </p>
      <Link href="/" className={styles.link}>
        Go home
      </Link>
    </div>
  );
};

export default NotFound;
