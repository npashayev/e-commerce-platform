'use client';
import { useState } from 'react';
import styles from './review-form.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

const ReviewForm = () => {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    return (
        <div className={styles.reviewForm}>
            <form>
                <textarea name="comment" className={styles.commentInput} placeholder="Write your review here..." rows={4} />
                <div className={styles.ratingCnr}>
                    <div className={styles.starsCnr}>
                        {
                            [...Array(5)].map((_, index) => {
                                return <FontAwesomeIcon
                                    key={index} icon={faStar}
                                    className={clsx(styles.star, (index + 1 <= rating || index + 1 <= hoveredRating) && styles.filled)}
                                    onClick={() => setRating(index + 1)}
                                    onMouseEnter={() => setHoveredRating(index + 1)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                />;
                            })
                        }
                    </div>
                    <button className={styles.addReviewBtn}>Add Review</button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;