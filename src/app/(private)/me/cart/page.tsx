import styles from './components/cart-page.module.scss';
import { getCartAction } from '@/app/actions/cart';
import CartPageClient from './components/CartPageClient';

export const metadata = {
    title: 'Shopping Cart',
    description: 'View and manage your shopping cart',
};

export default async function CartPage() {
    // No need for session check here as middleware handles it
    // and no dynamic params to handle

    const cartData = await getCartAction();

    return (
        <main className={styles.page}>
            <CartPageClient initialCartData={cartData} />
        </main>
    );
}

