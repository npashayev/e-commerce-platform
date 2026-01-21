'use client';

import { useActionState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './cart-page.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleMinus,
  faCirclePlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import Loading from '@/components/ui/loading/Loading';
import { CartProduct } from './CartPageClient';
import {
  updateCartItemAction,
  removeCartItemAction,
  CartActionState,
} from '@/app/actions/cart';

interface ProductItemProps {
  product: CartProduct;
  onCartUpdate: () => Promise<void>;
}

export default function ProductItem({
  product,
  onCartUpdate,
}: ProductItemProps) {
  const { id, cartItemId, title, thumbnail, quantity, totalPrice } = product;

  const [isPending, startTransition] = useTransition();

  const [updateState, updateAction] = useActionState<CartActionState, FormData>(
    updateCartItemAction,
    {},
  );

  const [removeState, removeAction] = useActionState<CartActionState, FormData>(
    removeCartItemAction,
    {},
  );

  // Refresh cart when actions complete
  useEffect(() => {
    if (updateState.success || removeState.success) {
      startTransition(() => {
        onCartUpdate();
      });
    }
  }, [updateState.success, removeState.success, onCartUpdate]);

  // Show error toasts
  useEffect(() => {
    if (updateState.error) {
      alert(updateState.error);
    }
    if (removeState.error) {
      alert(removeState.error);
    }
  }, [updateState.error, removeState.error]);

  const handleProductDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (confirm('Are you sure you want to remove this item from your cart?')) {
      const formData = new FormData();
      formData.set('cartItemId', cartItemId);
      startTransition(() => {
        removeAction(formData);
      });
    }
  };

  const handleQuantityChange = (e: React.MouseEvent, isIncrease = false) => {
    e.stopPropagation();
    e.preventDefault();

    const newQuantity = isIncrease ? quantity + 1 : quantity - 1;

    if (newQuantity < 1) {
      alert('Quantity cannot go below 1');
      return;
    }

    const formData = new FormData();
    formData.set('cartItemId', cartItemId);
    formData.set('quantity', String(newQuantity));
    startTransition(() => {
      updateAction(formData);
    });
  };

  return (
    <Link href={`/products/${id}`} className={styles.product}>
      <div className={styles.left}>
        <div className={styles.imageCnr}>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              width={80}
              height={80}
              className={styles.productImage}
            />
          ) : (
            <Loading />
          )}
        </div>

        <div className={styles.productMain}>
          <div className={styles.productTitle} title={title}>
            {title}
          </div>
          <div className={styles.productQuantityCnr}>
            <button
              className={styles.counterButton}
              disabled={quantity === 1 || isPending}
              onClick={e => handleQuantityChange(e)}
              type="button"
            >
              <FontAwesomeIcon
                className={styles.counterIcon}
                icon={faCircleMinus}
              />
            </button>

            <div className={styles.productQuantity}>{quantity}</div>

            <button
              className={styles.counterButton}
              disabled={isPending}
              onClick={e => handleQuantityChange(e, true)}
              type="button"
            >
              <FontAwesomeIcon
                className={styles.counterIcon}
                icon={faCirclePlus}
              />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.totalPrice}>${totalPrice.toFixed(2)}</div>

        <button
          className={styles.deleteBtn}
          onClick={handleProductDelete}
          disabled={isPending}
          type="button"
        >
          <FontAwesomeIcon icon={faTrashCan} className={styles.deleteIcon} />
        </button>
      </div>
    </Link>
  );
}
