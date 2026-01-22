/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import toast from 'react-hot-toast';
import { useActionState, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartPlus,
  faSpinner,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { addToCartAction, CartActionState } from '@/app/actions/cart';
import styles from './add-cart.module.scss';

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [state, formAction, isPending] = useActionState<
    CartActionState,
    FormData
  >(addToCartAction, {});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [state.success, state.timestamp]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error, state.timestamp]);

  return (
    <form action={formAction}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value="1" />
      <button
        type="submit"
        className={`${styles.addToCartBtn} ${showSuccess ? styles.success : ''}`}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <FontAwesomeIcon icon={faSpinner} spin />
            <span>Adding...</span>
          </>
        ) : showSuccess ? (
          <>
            <FontAwesomeIcon icon={faCheck} />
            <span>Added!</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCartPlus} />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </form>
  );
}
