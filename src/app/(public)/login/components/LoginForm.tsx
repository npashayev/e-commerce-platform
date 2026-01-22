'use client';

import styles from '@/styles/login-register-form.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { useAppDispatch } from '@/lib/hooks/useRedux';
import { setUser } from '@/lib/store/slices/userSlice';
import type { SafeUser } from '@/lib/types/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setErrors({ general: 'Invalid email or password' });
        toast.error('Login failed!');
      } else {
        // Update Redux with user data
        const session = await getSession();
        if (session?.user) {
          const userData = {
            id: session.user.id,
            firstName: session.user.firstName as string,
            lastName: session.user.lastName as string,
            username: session.user.username as string,
            email: session.user.email as string,
            role: session.user.role as string,
          } satisfies SafeUser;
          dispatch(setUser(userData));
        }

        toast.success('Logged in successfully!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrors({ general: 'An error occurred. Please try again.' });
      toast.error('Login failed!');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${styles.loginForm}`}>
      <h1 className={styles.formHeaderText}>Login</h1>

      {/* General error */}
      {errors.general && <div className={`${styles.error} ${styles.responseError}`}>{errors.general}</div>}

      {/* Email */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type="email" id="email" name="email" placeholder=" " disabled={isPending} required />
          <label htmlFor="email">Email</label>
        </div>
        {errors.email && (
          <div className={`${styles.error} ${styles.responseError}`}>{errors.email}</div>
        )}
      </div>

      {/* Password */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder=" " autoComplete="current-password" disabled={isPending} required />
          <label htmlFor="password">Password</label>
          <button type="button" className={styles.toggleBtn} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {errors.password && (
          <div className={`${styles.error} ${styles.responseError}`}>{errors.password}</div>
        )}
      </div>

      {/* Submit Button */}
      <div className={styles.buttonsCnr}>
        <button className={styles.btn} type="submit" disabled={isPending}>
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </div>

      {/* Link to register */}
      <div className={styles.linkCnr}>
        Don’t have an account?{' '}
        <Link href="/register" className={styles.link}>
          Register
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
