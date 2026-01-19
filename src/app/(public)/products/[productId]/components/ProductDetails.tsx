import styles from './product-details-page.module.scss';
import ProductInfoHeading from './ProductInfoHeading';
import ProductInfo from './ProductInfo';
import Reviews from './Reviews';
import { use } from 'react';
import { getProductById } from '@/lib/api/products';
import ProductGallery from './ProductGallery';
import ProductAdminActions from './ProductAdminActions';
import Link from 'next/link';

interface Props {
  productId: string;
}

const ProductDetails = ({ productId }: Props) => {
  const product = use(getProductById(productId));
  if (!product) return null;
  return (
    <main className={styles.page}>
      <div className={styles.actionsCnr}>
        <ProductAdminActions product={product} />
      </div>
      <div className={styles.headLine}>
        <div className={styles.categoryContainer}>
          Category /{' '}
          <Link href={`/products?category=${product.category}`} target="_blank" className={styles.categoryName}>
            {product.category}
          </Link>
        </div>
      </div>

      <div className={styles.mainInfo}>
        <div className={styles.gallery}>
          <ProductGallery product={product} />
        </div>

        <div className={styles.heading}>
          <ProductInfoHeading product={product} />
        </div>

        <div className={styles.info}>
          <ProductInfo product={product} />
        </div>
      </div>

      <Reviews productId={product.id} />
    </main>
  );
};

export default ProductDetails;
