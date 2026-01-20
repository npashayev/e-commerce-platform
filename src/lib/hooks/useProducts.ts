'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getProducts,
  GetProductsParams,
  PaginatedProductsResponse,
} from '@/lib/api/products';

const LIMIT = 30;

export interface UseProductsOptions {
  category?: string;
  sortBy?: string;
  order?: string;
  search?: string;
  initialData?: PaginatedProductsResponse;
}

const getNextPageParam = (lastPage: PaginatedProductsResponse) =>
  lastPage.hasMore ? lastPage.nextCursor : undefined;

export const useProducts = (options: UseProductsOptions) => {
  const { category, sortBy, order, search, initialData } = options;

  const params: Omit<GetProductsParams, 'cursor'> = {
    category,
    sortBy,
    order,
    search,
  };

  return useInfiniteQuery({
    queryKey: ['products', params],
    queryFn: ({ pageParam }) =>
      getProducts({ ...params, limit: LIMIT, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    staleTime: 1000 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// Helper to flatten all products from infinite query pages
export const flattenProducts = (
  data: { pages: PaginatedProductsResponse[] } | undefined
) => {
  if (!data?.pages) return [];
  return data.pages.flatMap((page) => page.products);
};
