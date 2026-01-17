import Link from 'next/link';
import styles from '@/styles/product-actions.module.scss';
import { PrivateComponent } from '@/components/shared/PrivateComponent';

const AddProductAction = () => {
    return (
        <PrivateComponent roles={["admin", "moderator"]}>
            <div className={styles.buttonsCnr}>
                <Link
                    href={'/admin/products/add'}
                    className={`${styles.addBtn} ${styles.button}`}
                >
                    Add product
                </Link>
            </div >
        </PrivateComponent>
    );
};

export default AddProductAction;