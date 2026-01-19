'use client';
import styles from './categories.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Category } from '@prisma/client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Props {
  categories: Category[];
  activeCategory: string;
}

const CategoriesContent = ({ activeCategory, categories }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleCategoryClick = (categorySlug: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('category', categorySlug);

    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className={styles.categories}>
      {categories.map(category => (
        <button
          className={
            activeCategory === category.slug
              ? `${styles.activeCategory} ${styles.category}`
              : styles.category
          }
          key={category.slug}
          onClick={() => handleCategoryClick(category.slug)}
        >
          <FontAwesomeIcon icon={faChevronRight} size="xs" /> {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoriesContent;
