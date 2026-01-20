import { getCategories } from '@/lib/api/products';
import { use } from 'react';
import AddProduct from './components/AddProduct';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Add Product',
  description: 'Add a new product to the catalog.',
  robots: { index: false, follow: false },
};

const AddProductPage = () => {
  const categories = use(getCategories());

  return <AddProduct categories={categories} />;
};

export default AddProductPage;
