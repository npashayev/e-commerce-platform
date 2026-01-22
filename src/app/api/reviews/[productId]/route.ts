import { fetchReviewsByProductIdFromDB } from '@/lib/prisma/api/products';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createReviewSchema } from '@/lib/validators/reviews';
import { createReviewForProductInDB } from '@/lib/prisma/api/products';

export async function GET(_req: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  try {
    const reviews = await fetchReviewsByProductIdFromDB(productId);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('[GET_REVIEWS_ERROR]', error);
    return NextResponse.json({ message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { productId } = await params;

  try {
    const body = await req.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const reviewerName =
      `${session.user.firstName ?? ''} ${session.user.lastName ?? ''}`.trim() ||
      session.user.username;

    if (!reviewerName || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const review = await createReviewForProductInDB({
      productId,
      userId: session.user.id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      reviewerName,
      reviewerEmail: session.user.email,
      date: new Date().toISOString(),
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('[CREATE_REVIEW_ERROR]', error);
    return NextResponse.json(
      { message: 'Failed to create review' },
      { status: 500 },
    );
  }
}
