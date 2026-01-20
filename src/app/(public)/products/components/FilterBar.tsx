'use client';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './filter-bar.module.scss';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';

// Dynamically import react-select to disable SSR
const Select = dynamic(() => import('react-select'), { ssr: false });
import AddProductAction from './AddProductAction';

interface SelectOption {
    value: string;
    label: string;
}

const options: SelectOption[] = [
    { value: 'default', label: 'Sort by' },
    { value: 'price-asc', label: 'Price Ascending' },
    { value: 'price-desc', label: 'Price Descending' },
    { value: 'rating-asc', label: 'Rating Ascending' },
    { value: 'rating-desc', label: 'Rating Descending' },
];

const FilterBar = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const urlSearchText = useMemo(() => searchParams.get('search') || '', [searchParams]);
    const [inputValue, setInputValue] = useState('');

    // Sync input value with URL when URL changes
    useEffect(() => {
        setInputValue(urlSearchText);
    }, [urlSearchText]);

    const sortBy = searchParams.get('sortBy');
    const order = searchParams.get('order');
    const selectorValue = (sortBy && order) ? `${sortBy}-${order}` : 'default';

    const selectedOption = options.find(opt => opt.value === selectorValue);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed) {
            router.push('/products');
            return;
        }

        router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    };

    const handleOptionChange = (selectedOption: unknown) => {
        if (!selectedOption) return;

        const option = selectedOption as SelectOption;
        const { value } = option;
        const newParams = new URLSearchParams(searchParams);

        if (value === "default") {
            newParams.delete('sortBy');
            newParams.delete('order');
        } else {
            const [sortByValue, orderValue] = value.split('-');
            newParams.set('sortBy', sortByValue);
            newParams.set('order', orderValue);
        }

        router.push(`${pathname}?${newParams.toString()}`);
    };

    return (
        <div className={styles.main}>
            <div className={styles.left}>
                <button className={styles.categoryBtn}>
                    <FontAwesomeIcon className={styles.categoryIcon} icon={faList} />
                </button>

                <div className={styles.leftEnd}>
                    <Select
                        className={styles.selector}
                        options={options}
                        isSearchable={false}
                        value={selectedOption}
                        onChange={handleOptionChange}
                    />

                    <AddProductAction />
                </div>
            </div>

            <div className={styles.right}>
                <form onSubmit={handleSearch} className={styles.form}>
                    <input
                        className={styles.searchBar}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder='Search for products...'
                    />
                    <button type='submit'>
                        <FontAwesomeIcon
                            className={styles.searchIcon}
                            icon={faMagnifyingGlass}
                        />
                    </button>
                </form>

            </div>
        </div>
    );
};

export default FilterBar;