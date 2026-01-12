import RegisterForm from './components/RegisterForm';
import styles from '@/styles/login-register-page.module.scss';

const RegisterPage = () => {
  return (
    <main className={styles.page}>
      <RegisterForm />
    </main>
  );
};

export default RegisterPage;
