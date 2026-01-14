import { use } from 'react';
import Categories from './components/Categories';
import ProductList from './components/ProductList';
import styles from './page.module.scss';

interface Props {
  searchParams: Promise<{
    category: string;
  }>;
}

const ProductsPage = ({ searchParams }: Props) => {
  const { category } = use(searchParams);
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Categories category={category} />
        <ProductList />
      </div>
    </div>
  );
};

export default ProductsPage;
