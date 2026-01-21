import { z } from 'zod';

export const createReviewSchema = z.object({
    rating: z
        .number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be between 1 and 5')
        .max(5, 'Rating must be between 1 and 5'),
    comment: z
        .string()
        .trim()
        .min(1, 'Comment is required')
        .max(300, 'Comment must be at most 300 characters'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

