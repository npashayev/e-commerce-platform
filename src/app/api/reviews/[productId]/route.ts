import { fetchReviewsByProductIdFromDB } from '@/lib/prisma/api/products';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  try {
    const reviews = await fetchReviewsByProductIdFromDB(productId);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('[GET_REVIEWS_ERROR]', error);
    return NextResponse.json({ message: 'Failed to fetch reviews' }, { status: 500 });
  }
}
