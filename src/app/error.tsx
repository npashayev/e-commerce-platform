'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/special-pages.module.scss';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error = ({ error, reset }: Props) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorPage}>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.description}>
        An error occurred. Please try again.
      </p>
      <div className={styles.actions}>
        <button onClick={reset} className={styles.retryBtn}>
          Try again
        </button>
        <Link href="/" className={styles.link}>
          Go home
        </Link>
      </div>
    </div>
  );
};

export default Error;
