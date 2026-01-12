import { getAllProducts } from '@/app/actions/product/getAllProducts';
import styles from './products.module.scss';
import ProductCard from './ProductCard';

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ProductList = async ({ searchParams }: Props) => {
    const params = (await searchParams) || {};

    const products = await getAllProducts({
        limit: params.limit ? Number(params.limit) : undefined,
        skip: params.skip ? Number(params.skip) : undefined,
        category: typeof params.category === 'string' ? params.category : undefined,
        searchQuery: typeof params.search === 'string' ? params.search : undefined,
        priceSort: params.priceSort === 'asc' || params.priceSort === 'desc' ? params.priceSort : undefined,
        ratingSort: params.ratingSort === 'asc' || params.ratingSort === 'desc' ? params.ratingSort : undefined,
    });

    return (
        <main className={styles.main}>
            <div className={styles.productsCnr}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
};

export default ProductList;