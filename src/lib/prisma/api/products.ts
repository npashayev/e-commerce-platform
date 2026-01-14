import { prisma } from '@/lib/prisma/prisma';

export async function fetchProductsFromDB() {
  return prisma.product.findMany();
}

export async function getProductByIdFromDB(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export async function fetchReviewsByProductIdFromDB(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { date: 'desc' }, // latest reviews first
  });
}

export async function fetchCategoriesFromDB() {
  return prisma.category.findMany();
}
