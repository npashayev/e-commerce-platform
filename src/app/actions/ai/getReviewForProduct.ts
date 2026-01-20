'use server';
import { gemini } from "@/lib/ai/gemini";
import { Product } from "@prisma/client";

export const getAiReviewForProduct = async (product: Product) => {
    const prePrompt = `
        You are a professional product reviewer. You will be provided with json object of a product to be reviewed.
        By carefully analyzing the product info, you will respond with detailed review about the product.
        Your review will include 3 sections: 
        1. General review based on product data
        2. Review based on shipping and warranty information
        3. Price considerations: Will it worth to buy this product for this price.
        BE PROFESSIONAL, HONEST AND CLEAR IN YOUR RESPONSE.
        `;
    const productJson = JSON.stringify(product);
    const fullPrompt = prePrompt + `PRODUCT JSON: \n ${productJson}`;

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