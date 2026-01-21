import styles from './reviews.module.scss';
import { use } from 'react';
import { getReviewsByProductId } from '@/lib/api/products';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';

interface Props {
  productId: string;
}

const Reviews = ({ productId }: Props) => {
  const reviews = use(getReviewsByProductId(productId));

  return (
    <div className={styles.main}>
      <h2 className={styles.heading}>Reviews & Rating</h2>
      <ReviewForm productId={productId} />
      <div className={styles.reviewsCnr}>
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              productId={productId}
            />
          ))
        ) : (
          <div>No reviews for this product</div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
