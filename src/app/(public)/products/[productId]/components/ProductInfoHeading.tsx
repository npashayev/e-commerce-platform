'use client';
import { useAiReview } from '@/lib/hooks/useAiReview';
import styles from './product-info-heading.module.scss';
import star from '@/assets/star.png';
import { faHexagonNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Product } from '@prisma/client';
import Image from 'next/image';
import { useState } from 'react';
import AiReviewModal from './AiReviewModal';
import useBodyScrollLock from '@/lib/hooks/useBodyScrollLock';
import { features } from '@/lib/config/features';

interface Props {
  product: Product;
}

const ProductInfoHeading = ({ product }: Props) => {
  const productRating = Math.round(product.rating * 10) / 10;
  const discountPercentage = Math.floor(product.discountPercentage);
  const newPrice = (product.price - (product.price * product.discountPercentage) / 100).toFixed(2);
  const { aiError, aiResponse, getReview, loading, clearError, clearAiResponse } = useAiReview({ product });
  const [modalOpen, setModalOpen] = useState(false);
  useBodyScrollLock(modalOpen);

  const handleGetReview = async () => {
    setModalOpen(true);
    await getReview();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    clearError();
    clearAiResponse();
  };

  const handleRetry = async () => {
    clearError();
    await getReview(true);
  };

  return (
    <>
      {features.aiReviewEnabled && (
        <AiReviewModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          loading={loading}
          error={aiError}
          aiResponse={aiResponse}
          onRetry={handleRetry}
        />
      )}
      <div className={styles.infoHeading}>
        <div className={styles.titleCnr}>
          <h1 className={styles.title}>{product.title}</h1>
          {features.aiReviewEnabled && (
            <button className={styles.aiBtn} onClick={handleGetReview} disabled={loading}>
              <span>Get AI Review</span>
              <FontAwesomeIcon icon={faHexagonNodes} className={styles.aiIcon} />
            </button>
          )}
        </div>

        <div className={styles.ratingCnr}>
          <div className={styles.starsCnr} style={{ width: `${(productRating / 5) * 90}px` }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.starCnr}>
                <Image src={star} alt="star" className={styles.star} />
              </div>
            ))}
          </div>

          <div className={styles.ratingSeparator} />

        </div>

        <div className={styles.priceCnr}>
          {discountPercentage > 0 && <span className={styles.oldPrice}>${product.price}</span>}
          <span className={styles.newPrice}>${newPrice}</span>
        </div>
      </div>
    </>

  );
};

export default ProductInfoHeading;
