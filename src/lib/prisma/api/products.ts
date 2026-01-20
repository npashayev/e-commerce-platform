import { prisma } from '@/lib/prisma/prisma';
import { Prisma, Product } from '@prisma/client';

export interface PaginatedProductsResult {
  products: Product[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

export interface FetchProductsOptions {
  category?: string;
  sortBy?: string;
  order?: string;
  cursor?: string;
  limit?: number;
}

export async function fetchProductsPaginated(
  options: FetchProductsOptions
): Promise<PaginatedProductsResult> {
  const { category, sortBy, order, cursor, limit = 30 } = options;
  
  const where: Prisma.ProductWhereInput = category && category !== 'all' 
    ? { category } 
    : {};

  const orderBy: Prisma.ProductOrderByWithRelationInput | undefined = 
    sortBy === 'price' ? { price: order === 'asc' ? 'asc' : 'desc' } :
    sortBy === 'rating' ? { rating: order === 'asc' ? 'asc' : 'desc' } :
    undefined;

  const total = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    ...(orderBy && { orderBy }),
    take: limit + 1,
    ...(cursor && {
      skip: 1, // Skip the cursor item itself
      cursor: {
        id: cursor,
      },
    }),
  });

  // Check if there are more products
  const hasMore = products.length > limit;
  
  // Remove the extra item if it exists
  const resultProducts = hasMore ? products.slice(0, limit) : products;
  
  // Get the cursor for the next page
  const nextCursor = hasMore && resultProducts.length > 0 
    ? resultProducts[resultProducts.length - 1].id 
    : null;

  return {
    products: resultProducts,
    nextCursor,
    hasMore,
    total,
  };
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
