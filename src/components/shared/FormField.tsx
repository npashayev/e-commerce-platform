import styles from '@/styles/resource-form.module.scss';

interface BaseProps {
  label: string;
  value?: string | number | null;
  type?: string;
  step?: string;
  required?: boolean;
}

interface InfoFieldProps extends Omit<BaseProps, 'name'> {}

interface EditFieldProps extends BaseProps {
  name: string;
}

export const InfoField = ({ label, value }: InfoFieldProps) => (
  <div className={styles.inputCnr}>
    <label>{label}</label>
    <p className={styles.info}>{value || ''}</p>
  </div>
);

export const EditField = ({
  label,
  value,
  name,
  type = 'text',
  step,
  required,
}: EditFieldProps) => (
  <div className={styles.inputCnr}>
    <label>{label}</label>
    <input
      className={styles.info}
      name={name}
      type={type}
      step={step}
      defaultValue={value || ''}
      required={required}
    />
  </div>
);
