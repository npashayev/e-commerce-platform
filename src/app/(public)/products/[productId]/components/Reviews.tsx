import Image from 'next/image';
import styles from './reviews.module.scss';
import star from '@/assets/star.png';
import { use } from 'react';
import { getReviewsByProductId } from '@/lib/api/products';
import ReviewForm from './ReviewForm';

interface Props {
  productId: string;
}

const Reviews = ({ productId }: Props) => {
  const reviews = use(getReviewsByProductId(productId));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.main}>
      <h2 className={styles.heading}>Reviews & Rating</h2>
      <ReviewForm />
      <div className={styles.reviewsCnr}>
        {reviews ? (
          reviews.map((review, i) => (
            <div key={i} className={styles.review}>
              <div className={styles.ratingCnr}>
                <div className={styles.starCnr}>
                  <Image src={star} fill className={styles.star} alt="star" />
                </div>
                <div className={styles.rating}>{review.rating}</div>
              </div>
              <div className={styles.body}>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{review.reviewerName}</div>
                  <div className={styles.date}>{formatDate(review.date)}</div>
                </div>
                <div className={styles.comment}>{review.comment}</div>
              </div>
            </div>
          ))
        ) : (
          <div>No reviews for this product</div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
