'use server';

import { prisma } from '@/lib/prisma/prisma';
import { Prisma } from '@prisma/client';

type GetProductsParams = {
  limit?: number;
  skip?: number;
  searchQuery?: string;
  category?: string;
  priceSort?: 'asc' | 'desc';
  ratingSort?: 'asc' | 'desc';
};

export async function getAllProducts(params: GetProductsParams = {}) {
  try {
    const { limit = 30, skip = 0, searchQuery, category, priceSort, ratingSort } = params;

    const where: Prisma.ProductWhereInput = {};

    if (category && category !== 'all') {
      // FIX: Added mode: 'insensitive' for MongoDB
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { brand: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];

    if (priceSort) {
      orderBy.push({ price: priceSort });
    }

    if (ratingSort) {
      orderBy.push({ rating: ratingSort });
    }

    if (orderBy.length === 0) {
      orderBy.push({ id: 'desc' });
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}
