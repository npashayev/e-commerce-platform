import RegisterForm from './components/RegisterForm';
import styles from '@/styles/login-register-page.module.scss';
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants/seo';

export const metadata: Metadata = {
  title: 'Create Account',
  description: `Create your ${SITE_NAME} account to start shopping, track orders, and enjoy personalized recommendations.`,
};

const RegisterPage = () => {
  return (
    <main className={styles.page}>
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;
