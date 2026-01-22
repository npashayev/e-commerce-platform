'use client';
import styles from '@/styles/resource-form.module.scss';
import ProductInfoReadOnly from './ProductInfoReadOnly';
import { useState } from 'react';
import type { Category, Product } from '@prisma/client';
import UpdateProductInfo from './UpdateProductInfo';

interface Props {
  product: Product;
  categories: Category[];
}

const UpdateProduct = ({ product, categories }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    product && (
      <main className={styles.page}>
        {isEditMode ? (
          <UpdateProductInfo
            product={product}
            categories={categories}
            onClose={() => setIsEditMode(false)}
          />
        ) : (
          <ProductInfoReadOnly
            product={product}
            onOpen={() => setIsEditMode(true)}
          />
        )}
      </main>
    )
  );
};

export default UpdateProduct;
