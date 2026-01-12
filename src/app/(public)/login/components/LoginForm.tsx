'use client';

import styles from '@/styles/login-register-form.module.scss';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signinAction } from '@/app/actions/auth/signinAction';

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(signinAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
      toast.success('Logged in successfully!');
      router.push('/'); // Change route as needed
    }
  }, [state, router]);

  return (
    <form action={formAction} className={`${styles.form} ${styles.loginForm}`}>
      <h1 className={styles.formHeaderText}>Login</h1>

      {/* General error */}
      {state?.generalError && <div className={`${styles.error} ${styles.responseError}`}>{state.generalError}</div>}

      {/* Email */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type="email" name="email" disabled={isPending} required />
          <label>Email</label>
        </div>
        {state?.fieldErrors?.email && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.email[0]}</div>
        )}
      </div>

      {/* Password */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type="password" name="password" autoComplete="current-password" disabled={isPending} required />
          <label>Password</label>
          <button type="button" className={styles.toggleBtn}></button>
        </div>
        {state?.fieldErrors?.password && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.password[0]}</div>
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
