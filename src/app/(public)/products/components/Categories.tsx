import styles from './categories.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import CategoriesContent from './CategoriesContent';
import { forwardRef } from 'react';

interface Props {
  category?: string;
}

const Categories = forwardRef<HTMLElement, Props>(({ category }, ref) => {
  const activeCategory = category ?? 'all';

  return (
    <aside className={styles.sidebar} ref={ref}>
      <div className={styles.categoriesHeading}>
        Categories
        <button className={styles.closeBtn}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <CategoriesContent activeCategory={activeCategory} />
    </aside>
  );
});

Categories.displayName = 'Categories';

export default Categories;
