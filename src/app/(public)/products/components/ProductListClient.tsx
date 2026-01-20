'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './products.module.scss';
import ProductCard from './ProductCard';
import { useProducts, flattenProducts } from '@/lib/hooks/useProducts';
import { PaginatedProductsResponse } from '@/lib/api/products';

interface Props {
  category?: string;
  sortBy?: string;
  order?: string;
  initialData: PaginatedProductsResponse;
}

const ProductListClient = ({ category, sortBy, order, initialData }: Props) => {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useProducts({
    category,
    sortBy,
    order,
    initialData,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const products = flattenProducts(data);

  if (isError) {
    return (
      <main className={styles.main}>
        <p className={styles.errorMessage}>
          Error loading products: {error?.message || 'Unknown error'}
        </p>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.productsCnr}>
        {products.length === 0 && !isLoading ? (
          <p className={styles.noProductsText}>No products found</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {isFetchingNextPage && (
        <div className={styles.loadingIndicator}>
          <span>Loading more products...</span>
        </div>
      )}

      <div ref={ref} style={{ height: 1, width: 1 }} />
    </main>
  );
};

export default ProductListClient;
