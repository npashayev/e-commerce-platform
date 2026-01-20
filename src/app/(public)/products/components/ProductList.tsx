import { getProductsServer } from '@/lib/api/products';
import ProductListClient from './ProductListClient';

interface Props {
  category?: string;
  sortBy?: string;
  order?: string;
}

const ProductList = async ({ category, sortBy, order }: Props) => {
  // Fetch initial 50 products on the server
  const initialData = await getProductsServer(category, sortBy, order);

  return (
    <ProductListClient
      category={category}
      sortBy={sortBy}
      order={order}
      initialData={initialData}
    />
  );
};

export default ProductList;
