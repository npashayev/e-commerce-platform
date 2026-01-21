'use client';
import Image from 'next/image';
import styles from './reviews.module.scss';
import star from '@/assets/star.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { deleteReviewAction } from '@/app/actions/review';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import { useState } from 'react';

interface Props {
    review: {
        id: string;
        userId: string;
        rating: number;
        comment: string;
        reviewerName: string;
        date: string;
    };
    productId: string;
}

const ReviewItem = ({ review, productId }: Props) => {
    const { user, role } = useAuth();
    const [deleting, setDeleting] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const canDelete = user?.id === review.userId || role === 'admin';

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this review?')) {
            return;
        }

        setDeleting(true);
        const result = await deleteReviewAction(review.id, productId);
        setDeleting(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success('Review deleted');
    };

    return (
        <div className={styles.review}>
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
            {canDelete && (
                <button
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                    disabled={deleting}
                    title="Delete review"
                >
                    <FontAwesomeIcon icon={faTrash} className={styles.deleteIcon} />
                </button>
            )}
        </div>
    );
};

export default ReviewItem;
