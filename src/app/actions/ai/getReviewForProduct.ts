'use server';
import { gemini } from "@/lib/ai/gemini";
import { Product } from "@prisma/client";
import { AI_PRODUCT_REVIEW_PROMPT } from "@/lib/constants/prompts";

export const getAiReviewForProduct = async (product: Product) => {
    const productJson = JSON.stringify(product);
    const fullPrompt = AI_PRODUCT_REVIEW_PROMPT + `PRODUCT JSON: \n ${productJson}`;

    try {
        const response = await gemini.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: fullPrompt,
        });
        return response.text;
    } catch (error) {
        console.error('Gemini API error:', error);
        
        // Re-throw with a more descriptive message
        if (error instanceof Error) {
            const message = error.message.toLowerCase();
            if (message.includes('429') || message.includes('quota') || message.includes('exhausted')) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
        }
        
        throw new Error('Failed to generate AI review. Please try again later.');
    }
};