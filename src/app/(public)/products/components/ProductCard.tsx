'use client';
import styles from './product-card.module.scss';
import star from "@/assets/star.png";
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@prisma/client';
import useSlideshow from '@/lib/hooks/useSlideShow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
// import AddToCartButton from './AddToCartButton';
// import LikeButton from 'components/common/products/LikeButton';

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    const imageLength = product.images?.length || 0;

    const discountPercentage = Math.floor(product.discountPercentage);
    const productRating = Math.round(product.rating * 10) / 10;
    const discountedPrice = (product.price - product.price * product.discountPercentage / 100).toFixed(2);

    const { activeIndex, increaseIndex, decreaseIndex, setActive } = useSlideshow({
        length: imageLength,
        time: 2000,
        initialIsActive: false,
        resetOnInactive: true
    });

    const handleActiveIndexChange = (e: React.MouseEvent<HTMLButtonElement>, direction: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (direction === 'right') {
            increaseIndex();
        } else {
            decreaseIndex();
        }
    };

    return (
        <Link
            href={`/products/${product.id}`}
            className={styles.product}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
        >

            <div className={styles.heading} title={product.brand}>
                <p className={styles.brand}>
                    {product.brand}
                </p>

                {/* <LikeButton className={styles.likeBtn} product={product} /> */}
            </div>
            {
                discountPercentage > 0 &&
                <div className={styles.discountPercentage}>
                    -{discountPercentage}%
                </div>
            }
            <div className={styles.imageCnr}>
                {
                    imageLength > 1 &&
                    <div className={styles.arrowBtnCnr}>
                        <button
                            className={styles.arrowBtn}
                            onClick={(e) => handleActiveIndexChange(e, "left")}
                        >
                            <FontAwesomeIcon className={styles.arrowIcon} icon={faChevronLeft} />
                        </button>

                        <button
                            className={styles.arrowBtn}
                            onClick={(e) => handleActiveIndexChange(e, "right")}
                        >
                            <FontAwesomeIcon className={styles.arrowIcon} icon={faChevronRight} />
                        </button>
                    </div>
                }
                {
                    product.images?.map((image, index) => <Image
                        key={index}
                        src={image}
                        fill
                        className={`${styles.image} ${index === activeIndex ? styles.activeImage : ''}`}
                        alt={product.title}
                    />)
                }

            </div>

            <div className={styles.circleCnr}>
                {
                    [...Array(imageLength)].map((_, i) => (
                        <div key={i} className={`${styles.circle} ${i === activeIndex ? styles.activeCircle : ''}`}></div>
                    ))
                }
            </div>

            <div className={styles.info}>
                <div className={styles.titleCnr}>
                    <p
                        className={styles.title}
                        title={product.title}
                    >
                        {product.title}
                    </p>
                    <div className={styles.ratingCnr}>
                        <div className={styles.rating}>{productRating}</div>
                        <div className={styles.starsCnr} style={{ width: `${(productRating / 5) * 60}px` }}>
                            {
                                [...Array(5)].map((_, i) => (
                                    <Image key={i} src={star} alt="star" className={styles.star} width={12.5} height={12.5} />
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.priceCnr}>
                        {discountPercentage > 0 &&
                            <p className={styles.oldPrice}>
                                ${product.price}
                            </p>
                        }
                        <p className={styles.newPrice}>${discountedPrice}</p>
                    </div>


                    {/* <AddToCartButton className={styles.addToCartBtn} product={product} >
                        <FontAwesomeIcon className={styles.basketIcon} icon={faBagShopping} />
                    </AddToCartButton> */}
                </div>
            </div>
        </Link >
    );
};

export default ProductCard;