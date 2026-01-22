'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createReviewSchema } from '@/lib/validators/reviews';
import {
    createReviewForProductInDB,
    getReviewByIdFromDB,
    deleteReviewFromDB,
} from '@/lib/prisma/api/products';
import { z } from 'zod';

export interface CreateReviewState {
    success?: boolean;
    error?: string;
    issues?: z.ZodIssue[];
}

export async function createReviewAction(
    _prevState: CreateReviewState | null,
    formData: FormData,
): Promise<CreateReviewState> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: 'Unauthorized' };
        }

        const productId = formData.get('productId') as string;
        const rating = formData.get('rating')
            ? parseInt(formData.get('rating') as string, 10)
            : undefined;
        const comment = formData.get('comment') as string;

        if (!productId) {
            return { error: 'Product ID is required' };
        }

        const parsed = createReviewSchema.safeParse({ rating, comment });
        if (!parsed.success) {
            return { error: 'Validation failed', issues: parsed.error.issues };
        }

        const reviewerName =
            `${session.user.firstName ?? ''} ${session.user.lastName ?? ''}`.trim() ||
            session.user.username;

        if (!reviewerName || !session.user.email) {
            return { error: 'Unauthorized' };
        }

        await createReviewForProductInDB({
            productId,
            userId: session.user.id,
            rating: parsed.data.rating,
            comment: parsed.data.comment,
            reviewerName,
            reviewerEmail: session.user.email,
            date: new Date().toISOString(),
        });

        revalidatePath(`/products/${productId}`);
        revalidatePath('/products');

        return { success: true };
    } catch (error) {
        console.error('[CREATE_REVIEW_ACTION_ERROR]', error);
        return { error: 'Failed to create review' };
    }
}

export interface DeleteReviewState {
    success?: boolean;
    error?: string;
}

export async function deleteReviewAction(
    reviewId: string,
    productId: string,
): Promise<DeleteReviewState> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: 'Unauthorized' };
        }

        const review = await getReviewByIdFromDB(reviewId);

        if (!review) {
            return { error: 'Review not found' };
        }

        // Allow deletion if user owns the review or is an admin
        const isOwner = review.userId === session.user.id;
        const isAdmin = session.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return { error: 'You do not have permission to delete this review' };
        }

        await deleteReviewFromDB(reviewId);

        revalidatePath(`/products/${productId}`);
        revalidatePath('/products');

        return { success: true };
    } catch (error) {
        console.error('[DELETE_REVIEW_ACTION_ERROR]', error);
        return { error: 'Failed to delete review' };
    }
}
