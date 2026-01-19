import React from 'react';
import styles from './categories.module.scss';
import CategoriesContent from './CategoriesContent';
import { use } from 'react';
import { getCategories } from '@/lib/api/products';
import { Category } from '@prisma/client';

interface Props {
  category?: string;
}

const Categories = ({ category }: Props) => {
  const activeCategory = category ?? 'all';
  const categories = use(getCategories());
  const extendedCategories: Category[] = [{ id: 'all', name: 'All', slug: "all" }, ...categories];
  return (
    <aside className={styles.sidebar}>
      <div className={styles.categoriesHeading}>Categories</div>

      <CategoriesContent
        categories={extendedCategories}
        activeCategory={activeCategory}
      />
    </aside>
  );
};

export default Categories;
