import styles from './products.module.scss';
import ProductCard from './ProductCard';
import { getProducts } from '@/lib/api/products';

const ProductList = async () => {
  const products = await getProducts();

  return (
    <main className={styles.main}>
      <div className={styles.productsCnr}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
};

export default ProductList;
