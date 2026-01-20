import { use } from 'react';
import ProductDetails from './components/ProductDetails';
import { Metadata } from 'next';
import { getProductById } from '@/lib/api/products';

interface Props {
  params: Promise<{
    productId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const discountedPrice = (product.price - (product.price * product.discountPercentage) / 100).toFixed(2);

  return {
    title: product.title,
    description: product.description.slice(0, 160),
    keywords: [product.category, product.brand, ...product.tags].filter(Boolean) as string[],
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.images?.[0] ? [{ url: product.images[0], alt: product.title }] : [],
      type: 'website',
    },
    other: {
      'product:price:amount': discountedPrice,
      'product:price:currency': 'USD',
    },
  };
}

const ProductDetailsPage = ({ params }: Props) => {
  const { productId } = use(params);

  return <ProductDetails productId={productId} />;
};

export default ProductDetailsPage;
