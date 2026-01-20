import { getCategories } from '@/lib/api/products';
import { use } from 'react';
import AddProduct from './components/AddProduct';

export const dynamic = 'force-dynamic';

const AddProductPage = () => {
    const categories = use(getCategories());

    return <AddProduct categories={categories} />;
};

export default AddProductPage;
