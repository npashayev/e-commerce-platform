import LoginForm from './components/LoginForm';
import styles from '@/styles/login-register-page.module.scss';
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants/seo';

export const metadata: Metadata = {
  title: 'Sign In',
  description: `Sign in to your ${SITE_NAME} account to access your orders, wishlist, and personalized recommendations.`,
};

const SigninPage = () => {
  return (
    <main className={styles.page}>
      <LoginForm />
    </main>
  );
};

export default SigninPage;
