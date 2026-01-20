import { getCategories, getProductById } from '@/lib/api/products';
import { use } from 'react';
import UpdateProduct from './components/UpdateProduct';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Update Product',
  description: 'Update product information.',
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{
    productId: string;
  }>;
}

const UpdateProductPage = ({ params }: Props) => {
  const { productId } = use(params);
  const product = use(getProductById(productId));
  const categories = use(getCategories());

  return <UpdateProduct product={product} categories={categories} />;
};

export default UpdateProductPage;
