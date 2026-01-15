import styles from '@/styles/resource-form.module.scss';

interface Props {
  label: string;
  value?: string | number | null;
}

export const InfoField = ({ label, value }: Props) => (
  <div className={styles.inputCnr}>
    <label>{label}</label>
    <p className={styles.info}>{value || ''}</p>
  </div>
);

export const EditField = ({ label, value }: Props) => (
  <div className={styles.inputCnr}>
    <label>{label}</label>
    <p className={styles.info}>{value || ''}</p>
  </div>
);
