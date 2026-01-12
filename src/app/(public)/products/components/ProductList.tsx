import { getAllProducts } from '@/app/actions/product/getAllProducts';
import { use } from 'react';
import styles from './products.module.scss';
import ProductCard from './ProductCard';

const ProductList = () => {
    const products = use(getAllProducts());
    return (
        <main className={styles.main}>
            <div className={styles.productsCnr}>
                {
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                }
            </div>
        </main>
    );
};

export default ProductList;
