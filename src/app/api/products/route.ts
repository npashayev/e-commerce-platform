import { fetchProductsFromDB } from '@/lib/prisma/api/products';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await fetchProductsFromDB(); // pure fetch, no params
    return NextResponse.json(products);
  } catch (error) {
    console.error('[GET_PRODUCTS_ERROR]', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}
