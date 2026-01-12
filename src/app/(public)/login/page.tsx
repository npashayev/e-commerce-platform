import LoginForm from './components/LoginForm';
import styles from '@/styles/login-register-page.module.scss';

const SigninPage = () => {
  return (
    <main className={styles.page}>
      <LoginForm />
    </main>
  );
};

export default SigninPage;
