import styles from './categories.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { use } from 'react';
import { getCategories } from '@/lib/api/products';

interface Props {
  activeCategory: string;
}

const CategoriesContent = ({ activeCategory }: Props) => {
  const categories = use(getCategories());
  return (
    <div className={styles.categories}>
      <Link
        className={activeCategory === 'all' ? `${styles.activeCategory} ${styles.category}` : styles.category}
        href={'/products'}
      >
        <FontAwesomeIcon icon={faChevronRight} size="xs" /> All
      </Link>

      {categories?.map(category => (
        <Link
          className={activeCategory === category.slug ? `${styles.activeCategory} ${styles.category}` : styles.category}
          key={category.slug}
          href={`/products/category/${category.slug}`}
        >
          <FontAwesomeIcon icon={faChevronRight} size="xs" /> {category.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoriesContent;
