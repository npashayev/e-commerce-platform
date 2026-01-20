'use client';

import styles from '@/styles/login-register-form.module.scss';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signupAction } from '@/app/actions/auth/signupAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(signupAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          <input type="text" id="firstName" name="firstName" placeholder=" " disabled={isPending} required />
          <label htmlFor="firstName">First name</label>
        </div>
        {state?.fieldErrors?.firstName && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.firstName[0]}</div>
        )}
      </div>

      {/* Last Name */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type="text" id="lastName" name="lastName" placeholder=" " disabled={isPending} required />
          <label htmlFor="lastName">Last name</label>
        </div>
        {state?.fieldErrors?.lastName && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.lastName[0]}</div>
        )}
      </div>

      {/* Email */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type="email" id="email" name="email" placeholder=" " disabled={isPending} required />
          <label htmlFor="email">Email</label>
        </div>
        {state?.fieldErrors?.email && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.email[0]}</div>
        )}
      </div>

      {/* Username */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type="text" id="username" name="username" placeholder=" " autoComplete="username" disabled={isPending} required />
          <label htmlFor="username">Username</label>
        </div>
        {state?.fieldErrors?.username && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.username[0]}</div>
        )}
      </div>

      {/* Password */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder=" " autoComplete="new-password" disabled={isPending} required />
          <label htmlFor="password">Password</label>
          <button type="button" className={styles.toggleBtn} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        {state?.fieldErrors?.password && (
          <div className={`${styles.error} ${styles.responseError}`}>{state.fieldErrors.password[0]}</div>
        )}
      </div>

      {/* Confirm Password */}
      <div className={styles.inputField}>
        <div className={styles.inputCnr}>
          <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" placeholder=" " autoComplete="new-password" disabled={isPending} required />
          <label htmlFor="confirmPassword">Confirm password</label>
          <button type="button" className={styles.toggleBtn} onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
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
