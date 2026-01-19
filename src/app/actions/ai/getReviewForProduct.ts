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

    const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: fullPrompt,
    });
    console.log(response.text);
    return response.text;
};