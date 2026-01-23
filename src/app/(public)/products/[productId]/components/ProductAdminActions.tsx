'use client';
import { PrivateComponent } from '@/components/shared/PrivateComponent';
import styles from '@/styles/product-actions.module.scss';
import type { Product } from '@prisma/client';
import Link from 'next/link';
import { deleteProductAction } from '@/app/actions/product';
import { useTransition } from 'react';
import { useInvalidateProducts } from '@/lib/hooks/useInvalidateProducts';
import toast from 'react-hot-toast';

interface Props {
    product: Product;
}

const ProductAdminActions = ({ product }: Props) => {
    const [isPending, startTransition] = useTransition();
    const { invalidateAllProductData } = useInvalidateProducts();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${product.title}"? This action cannot be undone.`)) {
            return;
        }

        startTransition(async () => {
            try {
                await deleteProductAction(product.id);
                // Invalidate React Query cache after successful deletion
                invalidateAllProductData();
            } catch (error) {
                if (!(error instanceof Error && error.message === 'NEXT_REDIRECT')) {
                    toast.error('Failed to delete product');
                    console.error('Delete error:', error);
                }
            }
        });
    };
    return (
        <div className={styles.buttonsCnr}>
            <PrivateComponent roles={["admin", "moderator"]}>
                <Link
                    href={`/admin/products/${product.id}/update`}
                    className={`${styles.updateBtn} ${styles.button}`}
                >
                    Update
                </Link>
            </PrivateComponent>

            <PrivateComponent roles={["admin"]}>
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className={`${styles.deleteBtn} ${styles.button}`}
                >
                    {isPending ? 'Deleting...' : 'Delete'}
                </button>
            </PrivateComponent>
        </div>
    );
};

export default ProductAdminActions;