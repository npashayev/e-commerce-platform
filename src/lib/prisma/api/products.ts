import { prisma } from '@/lib/prisma/prisma';
import { Prisma } from '@prisma/client';

export async function fetchProductsFromDB(category?: string) {
  const where = category && category !== 'all' ? { category } : {};
  return prisma.product.findMany({
    where,
  });
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

export async function updateProductInDB(
  id: string,
  data: Prisma.ProductUpdateInput,
) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function createProductInDB(data: Prisma.ProductCreateInput) {
  return prisma.product.create({
    data,
  });
}

export async function deleteProductFromDB(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}
