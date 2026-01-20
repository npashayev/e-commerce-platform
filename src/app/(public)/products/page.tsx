import { use } from 'react';
import Categories from './components/Categories';
import ProductList from './components/ProductList';
import styles from './page.module.scss';
import FilterBar from './components/FilterBar';
import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants/seo';

interface Props {
  searchParams: Promise<{
    category?: string;
    sortBy?: string;
    order?: string;
    search?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category, search } = await searchParams;

  let title = 'All Products';
  let description = 'Browse our complete collection of quality products.';

  if (search) {
    title = `Search: "${search}"`;
    description = `Search results for "${search}" - Find the best deals on ${SITE_NAME}.`;
  } else if (category && category !== 'all') {
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    title = formattedCategory;
    description = `Shop ${formattedCategory} - Discover amazing products in our ${formattedCategory} collection.`;
  }

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

const ProductsPage = ({ searchParams }: Props) => {
  const { category, sortBy, order, search } = use(searchParams);
  return (
    <div className={styles.page}>
      <FilterBar />
      <div className={styles.content}>
        <Categories category={category} />
        <ProductList category={category} sortBy={sortBy} order={order} search={search} />
      </div>
    </div>
  );
};

export default ProductsPage;
