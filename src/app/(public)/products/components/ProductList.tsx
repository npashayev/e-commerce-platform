import styles from './products.module.scss';
import ProductCard from './ProductCard';
import { getProducts } from '@/lib/api/products';

interface Props {
  category?: string;
}

const ProductList = async ({ category }: Props) => {
  const products = await getProducts(category);

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
