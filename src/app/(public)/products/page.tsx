import { use } from 'react';
import Categories from './components/Categories';
import ProductList from './components/ProductList';
import styles from './page.module.scss';
import FilterBar from './components/FilterBar';

interface Props {
  searchParams: Promise<{
    category?: string;
    sortBy?: string;
    order?: string;
  }>;
}

const ProductsPage = ({ searchParams }: Props) => {
  const { category, sortBy, order } = use(searchParams);
  return (
    <div className={styles.page}>
      <FilterBar />
      <div className={styles.content}>
        <Categories category={category} />
        <ProductList category={category} sortBy={sortBy} order={order} />
      </div>
    </div>
  );
};

export default ProductsPage;
