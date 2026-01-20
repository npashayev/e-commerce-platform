import { getProductsServer } from '@/lib/api/products';
import ProductListClient from './ProductListClient';

interface Props {
  category?: string;
  sortBy?: string;
  order?: string;
  search?: string;
}

const ProductList = async ({ category, sortBy, order, search }: Props) => {
  const initialData = await getProductsServer(category, sortBy, order, search);

  return (
    <ProductListClient
      category={category}
      sortBy={sortBy}
      order={order}
      search={search}
      initialData={initialData}
    />
  );
};

export default ProductList;
