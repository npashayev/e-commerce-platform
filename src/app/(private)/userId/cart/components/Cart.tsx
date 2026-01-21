'use client';

import styles from './cart-page.module.scss';
import ProductItem from './ProductItem';
import { CartProduct } from './CartPageClient';

interface CartProps {
  products: CartProduct[];
  onCartUpdate: () => Promise<void>;
}

export default function Cart({ products, onCartUpdate }: CartProps) {
  return (
    <div className={styles.cart}>
      <div className={styles.productsCnr}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductItem
              key={product.cartItemId}
              product={product}
              onCartUpdate={onCartUpdate}
            />
          ))
        ) : (
          <div className={styles.message}>
            There is no product added to this cart
          </div>
        )}
      </div>
    </div>
  );
}
