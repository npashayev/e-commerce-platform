'use client';

import styles from '@/styles/login-register-form.module.scss';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signupAction } from '@/app/actions/auth/signupAction';

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(signupAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      toast.success('Registered successfully!');
      router.push('/login');
    }
  }, [state, router]);

  return (
    <form action={formAction} className={`${styles.form} ${styles.registerForm}`}>
      <h1 className={styles.formHeaderText}>Register</h1>

      {/* General error */}
      {state?.generalError && <div className={`${styles.error} ${styles.responseError}`}>{state.generalError}</div>}

      {/* First Name */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type="text" name="firstName" disabled={isPending} required />
          <label>First name</label>
        </div>
        {state?.fieldErrors?.firstName && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.firstName[0]}</div>
        )}
      </div>

      {/* Last Name */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type="text" name="lastName" disabled={isPending} required />
          <label>Last name</label>
        </div>
        {state?.fieldErrors?.lastName && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.lastName[0]}</div>
        )}
      </div>

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

      {/* Username */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type="text" name="username" autoComplete="username" disabled={isPending} required />
          <label>Username</label>
        </div>
        {state?.fieldErrors?.username && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.username[0]}</div>
        )}
      </div>

      {/* Password */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type="password" name="password" autoComplete="new-password" disabled={isPending} required />
          <label>Password</label>
          <button type="button" className={styles.toggleBtn}></button>
        </div>
        {state?.fieldErrors?.password && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.password[0]}</div>
        )}
      </div>

      {/* Confirm Password */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type="password" name="confirmPassword" autoComplete="new-password" disabled={isPending} required />
          <label>Confirm password</label>
        </div>
        {state?.fieldErrors?.confirmPassword && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.confirmPassword[0]}</div>
        )}
      </div>

      {/* Submit Button */}
      <div className={styles.buttonsCnr}>
        <button className={styles.btn} type="submit" disabled={isPending}>
          {isPending ? 'Registering...' : 'Register'}
        </button>
      </div>

      {/* Link to login */}
      <div className={styles.linkCnr}>
        Already have an account?{' '}
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
