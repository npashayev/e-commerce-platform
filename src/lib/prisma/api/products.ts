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
  search?: string;
}

// Raw MongoDB document type from aggregateRaw
interface RawProduct {
  _id: { $oid: string };
  [key: string]: unknown;
}

// Fuzzy search using MongoDB Atlas Search
async function fuzzySearchProducts(
  search: string,
  category?: string,
  skip = 0,
  limit = 30,
  sortBy?: string,
  order?: string
): Promise<Product[]> {
  const searchStage = {
    $search: {
      index: 'products_search',
      compound: {
        should: [
          {
            text: {
              query: search,
              path: 'title',
              fuzzy: { maxEdits: 2 },
              score: { boost: { value: 3 } },
            },
          },
          {
            text: {
              query: search,
              path: 'brand',
              fuzzy: { maxEdits: 2 },
              score: { boost: { value: 2 } },
            },
          },
          {
            text: {
              query: search,
              path: 'description',
              fuzzy: { maxEdits: 1 },
            },
          },
        ],
        minimumShouldMatch: 1,
      },
    },
  };

  const pipeline: object[] = [searchStage];

  // Add category filter if provided
  if (category && category !== 'all') {
    pipeline.push({ $match: { category } });
  }

  // Add sorting if provided (otherwise Atlas Search sorts by relevance by default)
  if (sortBy && order) {
    const sortDirection = order === 'asc' ? 1 : -1;
    if (sortBy === 'price') {
      pipeline.push({ $sort: { price: sortDirection } });
    } else if (sortBy === 'rating') {
      pipeline.push({ $sort: { rating: sortDirection } });
    }
  }

  // Add pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  const rawResults = await prisma.product.aggregateRaw({
    pipeline,
  }) as unknown as RawProduct[];

  // Map _id.$oid to id for Prisma compatibility
  return rawResults.map((doc) => ({
    ...doc,
    id: doc._id.$oid,
  })) as unknown as Product[];
}

// Count fuzzy search results
async function countFuzzySearchResults(
  search: string,
  category?: string
): Promise<number> {
  const pipeline: object[] = [
    {
      $search: {
        index: 'products_search',
        compound: {
          should: [
            { text: { query: search, path: 'title', fuzzy: { maxEdits: 2 } } },
            { text: { query: search, path: 'brand', fuzzy: { maxEdits: 2 } } },
            { text: { query: search, path: 'description', fuzzy: { maxEdits: 1 } } },
          ],
          minimumShouldMatch: 1,
        },
      },
    },
  ];

  if (category && category !== 'all') {
    pipeline.push({ $match: { category } });
  }

  pipeline.push({ $count: 'total' });

  const result = await prisma.product.aggregateRaw({ pipeline }) as unknown as { total: number }[];
  return result[0]?.total || 0;
}

export async function fetchProductsPaginated(
  options: FetchProductsOptions
): Promise<PaginatedProductsResult> {
  const { category, sortBy, order, cursor, limit = 30, search } = options;

  // Use fuzzy search if search term provided
  if (search?.trim()) {
    // For cursor-based pagination with search, we use skip
    // Find the position of cursor in results
    let skip = 0;
    if (cursor) {
      // For simplicity with Atlas Search, we'll use offset pagination
      // The cursor represents the number of items to skip
      skip = parseInt(cursor, 10) || 0;
    }

    const [products, total] = await Promise.all([
      fuzzySearchProducts(search.trim(), category, skip, limit + 1, sortBy, order),
      countFuzzySearchResults(search.trim(), category),
    ]);

    const hasMore = products.length > limit;
    const resultProducts = hasMore ? products.slice(0, limit) : products;
    const nextCursor = hasMore ? String(skip + limit) : null;

    return {
      products: resultProducts,
      nextCursor,
      hasMore,
      total,
    };
  }

  // Regular query without search
  const where: Prisma.ProductWhereInput = {
    ...(category && category !== 'all' && { category }),
  };

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
      skip: 1,
      cursor: { id: cursor },
    }),
  });

  const hasMore = products.length > limit;
  const resultProducts = hasMore ? products.slice(0, limit) : products;
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
