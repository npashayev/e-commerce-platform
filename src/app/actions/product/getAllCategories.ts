'use server';

import { prisma } from '@/lib/prisma/prisma';

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}
