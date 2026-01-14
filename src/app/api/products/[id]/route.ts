import { NextResponse } from 'next/server';
import { getProductByIdFromDB } from '@/lib/prisma/api/products';

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;

  if (!id) {
    // Handle missing ID parameter
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  try {
    // Fetch product from DB
    const product = await getProductByIdFromDB(id);

    if (!product) {
      // Product not found
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Return product successfully
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    // Log full error for debugging
    console.error('[GET_PRODUCT_BY_ID_ERROR]', { error, productId: id });

    // Return generic server error
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}
