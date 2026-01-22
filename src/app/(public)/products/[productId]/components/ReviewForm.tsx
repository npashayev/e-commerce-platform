'use client';
import { useState, useActionState, useEffect, useRef } from 'react';
import styles from './review-form.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import { createReviewAction } from '@/app/actions/review';

interface Props {
    productId: string;
}

const ReviewForm = ({ productId }: Props) => {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [state, formAction, isPending] = useActionState(createReviewAction, null);
    const { isAuthenticated } = useAuth();
    const prevSuccessRef = useRef<boolean>(false);

    useEffect(() => {
        if (state?.success && !prevSuccessRef.current) {
            prevSuccessRef.current = true;
            toast.success('Review added');
        } else if (state?.error) {
            // Only show toast for non-validation errors (validation errors are shown inline)
            if (state.error === 'Unauthorized') {
                toast.error('You should log in to add a comment.');
            } else if (state.error !== 'Validation failed') {
                toast.error(state.error);
            }
        }
    }, [state]);

    useEffect(() => {
        if (state?.success && prevSuccessRef.current) {
            const timer = setTimeout(() => {
                setRating(0);
                setHoveredRating(0);
                setComment('');
                prevSuccessRef.current = false;
            }, 100);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [state?.success]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!isAuthenticated) {
            e.preventDefault();
            toast.error('You should log in to add a comment.');
            return;
        }
    };

    const getValidationError = () => {
        if (state?.error === 'Validation failed' && state.issues) {
            const commentError = state.issues.find(issue =>
                issue.path.includes('comment')
            );
            const ratingError = state.issues.find(issue =>
                issue.path.includes('rating')
            );

            if (commentError) {
                return commentError.message;
            } else if (ratingError) {
                return ratingError.message;
            }
        }
        return '';
    };

    const validationError = getValidationError();

    return (
        <div className={styles.reviewForm}>
            <form action={formAction} onSubmit={handleSubmit}>
                <input type="hidden" name="productId" value={productId} />
                <input type="hidden" name="rating" value={rating} />
                {validationError && (
                    <div className={styles.errorMessage}>
                        {validationError}
                    </div>
                )}
                <textarea
                    name="comment"
                    className={clsx(styles.commentInput, validationError && styles.commentInputError)}
                    placeholder="Write your review here..."
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
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
                    <button
                        type="submit"
                        className={styles.addReviewBtn}
                        disabled={isPending}
                    >
                        {isPending ? 'Adding...' : 'Add Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;