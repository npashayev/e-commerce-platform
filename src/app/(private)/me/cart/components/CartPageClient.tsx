'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './cart-page.module.scss';
import Cart from './Cart';
import CartPageHeader from './CartPageHeader';
import CardDetails from './CardDetails';

export interface CartProduct {
  id: string;
  cartItemId: string;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  quantity: number;
  totalPrice: number;
}

export interface CartData {
  products: CartProduct[];
  totalPrice: number;
  totalProducts: number;
  totalQuantity: number;
  error?: string;
}

interface CartPageClientProps {
  initialCartData: CartData | { error: string };
}

export default function CartPageClient({
  initialCartData,
}: CartPageClientProps) {
  const router = useRouter();

  // Use props directly as source of truth
  const cartData: CartData =
    'error' in initialCartData
      ? {
          products: [],
          totalPrice: 0,
          totalProducts: 0,
          totalQuantity: 0,
          error: initialCartData.error,
        }
      : initialCartData;

  const [showDemoNotice, setShowDemoNotice] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const refreshCart = useCallback(async () => {
    // Refresh the server components to get fresh data
    router.refresh();
  }, [router]);

  // Scroll page smoothly to the checkout form
  const goCheckout = () => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  // Show demo notice on first visit
  useEffect(() => {
    if (showDemoNotice) {
      const timer = setTimeout(() => {
        setShowDemoNotice(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showDemoNotice]);

  return (
    <>
      {showDemoNotice && (
        <div className={styles.demoNotice}>
          <p>
            This is a demo cart page. The checkout form does not process real
            transactions.
          </p>
          <button onClick={() => setShowDemoNotice(false)}>×</button>
        </div>
      )}

      <div className={styles.cartCnr}>
        <CartPageHeader goCheckout={goCheckout} />
        <Cart products={cartData.products} onCartUpdate={refreshCart} />
      </div>

      <CardDetails
        ref={inputRef}
        totalPrice={cartData.totalPrice}
        totalProducts={cartData.totalProducts}
        totalQuantity={cartData.totalQuantity}
        onCheckoutSuccess={refreshCart}
      />
    </>
  );
}
