import { use } from 'react';
import ProductDetails from './components/ProductDetails';

interface Props {
  params: Promise<{
    productId: string;
  }>;
}

const ProductDetailsPage = ({ params }: Props) => {
  const { productId } = use(params);

  return <ProductDetails productId={productId} />;
};

export default ProductDetailsPage;
