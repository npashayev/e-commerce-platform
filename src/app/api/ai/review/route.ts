import { NextResponse } from 'next/server';
import { gemini } from '@/lib/ai/gemini';
import { prisma } from '@/lib/prisma/prisma';
import { AI_PRODUCT_REVIEW_PROMPT } from '@/lib/constants/prompts';
import { features } from '@/lib/config/features';

export async function POST(request: Request) {
  if (!features.aiReviewEnabled) {
    return NextResponse.json(
      { error: 'AI Review feature is currently disabled' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Fetch the product from database
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Generate AI review
    const productJson = JSON.stringify(product);
    const fullPrompt = AI_PRODUCT_REVIEW_PROMPT + `PRODUCT JSON: \n ${productJson}`;

    const response = await gemini.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: fullPrompt,
    });

    return NextResponse.json({
      review: response.text,
      productId: product.id,
    });
  } catch (error) {
    console.error('AI Review API error:', error);

    // Check for rate limit errors
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (
        message.includes('429') ||
        message.includes('quota') ||
        message.includes('exhausted')
      ) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate AI review. Please try again later.' },
      { status: 500 }
    );
  }
}
