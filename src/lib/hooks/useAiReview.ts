import { useState } from "react";
import { Product } from "@prisma/client";
import { getAiReviewForProduct } from "@/app/actions/ai/getReviewForProduct";
import { useLocalStorage } from "./useLocalStorage";

interface Props {
    product: Product
}

interface CachedReview {
    review: string;
    timestamp: number;
}

const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours

export function useAiReview({ product }: Props) {
    const [loading, setLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [storedReview, setStoredReview] = useLocalStorage<CachedReview | null>(`aiProductReview-${product.id}`, null);

    const clearAiResponse = () => {
        setAiResponse(null);
    };

    const clearError = () => {
        setAiError(null);
    };

    const getReview = async (forceRefresh = false) => {
        const now = Date.now();

        // Check if we have a valid cached review
        if (
            !forceRefresh &&
            storedReview &&
            storedReview.review
            &&
            (now - storedReview.timestamp) < CACHE_DURATION
        ) {
            setAiResponse(storedReview.review);
            return storedReview.review;
        }

        setLoading(true);
        setAiError(null);

        try {
            const response = await getAiReviewForProduct(product);

            if (!response) {
                throw new Error('Empty response from AI service');
            }

            setAiResponse(response);
            setStoredReview({ review: response, timestamp: now });
            setAiError(null);
            return response;

        } catch (error: unknown) {
            console.error('AI Review error:', error);

            const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
            
            // Check for rate limit errors (server actions serialize errors, so check message)
            const isRateLimitError = 
                errorMessage.includes('429') ||
                errorMessage.includes('rate limit') ||
                errorMessage.includes('exhausted') ||
                errorMessage.includes('quota') ||
                errorMessage.includes('too many requests');

            if (isRateLimitError) {
                setAiError('Rate limit exceeded. Please try again later.');
                setAiResponse(null);
                return null;
            }

            setAiResponse(null);
            setAiError(
                error instanceof Error && error.message
                    ? error.message
                    : 'Unfortunately, AI could not generate a review. Please try again later.'
            );
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        getReview,
        loading,
        aiError,
        aiResponse,
        clearError,
        clearAiResponse,
    };
}