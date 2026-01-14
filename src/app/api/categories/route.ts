import { fetchCategoriesFromDB } from '@/lib/prisma/api/products';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const categories = await fetchCategoriesFromDB();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('[GET_CATEGORIES_ERROR]', error);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}
